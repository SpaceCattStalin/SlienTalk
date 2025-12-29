
import { colors } from '@/global/theme';
import React from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
// import {Coords} from '../@types';
import { IOverlayComponentProps } from 'react-native-interactive-walkthrough';

type Coords = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type Props = {
    text: string;
    subText: string;
    buttonLabel: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    tooltipInsets?: Coords;
    libProps: IOverlayComponentProps;
    onButtonPress: () => void;
};

const TooltipWalk = ({
    text,
    subText,
    buttonLabel,
    libProps,
    tooltipInsets = { x: 0, y: 0, width: 0, height: 0 },
    position = 'top',
    onButtonPress,
}: Props) => {
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height - 200;
    const { x, y, width, height } = libProps.step.mask;
    const tooltipStyles: ViewStyle = {};
    const tooltipWidth = 280;

    switch (position) {
        case 'top':
            tooltipStyles.top = y - 40 - tooltipInsets?.y;
            tooltipStyles.left = x + width / 4 - tooltipInsets?.x;
            break;
        case 'bottom':
            tooltipStyles.top = y + height + 10 + tooltipInsets?.y;
            tooltipStyles.left = x + width / 4 - tooltipInsets?.x;
            break;
        case 'left':
            tooltipStyles.top = y + height / 2 - 20 + tooltipInsets?.y;
            tooltipStyles.left = x - 110 + tooltipInsets?.x;
            break;
        case 'right':
            tooltipStyles.top = y + height / 2 - 20 + tooltipInsets?.y;
            tooltipStyles.left = x + width + 10 + tooltipInsets?.x;
            break;
        default:
            tooltipStyles.top = y - 40 - tooltipInsets?.y;
            tooltipStyles.left = x + width / 4 - tooltipInsets?.x;
    }
    if (tooltipStyles.left < 0) {
        tooltipStyles.left = 10;
    } else if (tooltipStyles.left + tooltipWidth > screenWidth) {
        tooltipStyles.left = screenWidth - tooltipWidth - 10;
    }

    if (tooltipStyles.top < 0) {
        tooltipStyles.top = y + height + 10;
    } else if (tooltipStyles.top + 50 > screenHeight) {
        tooltipStyles.top = y - 60;
    }

    return (
        <View style={[styles.container, tooltipStyles]}>
            <View style={styles.overlay}>
                <Text style={styles.title}>{text}</Text>
                <Text style={styles.subtitle}>
                    {subText}
                </Text>
                <View style={styles.separator} />
                <Pressable style={[
                    styles.button,
                ]} onPress={onButtonPress}
                >
                    <Text style={styles.buttonText}>
                        Tiếp theo
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default TooltipWalk;

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-start",
        position: 'absolute'
    },
    overlay: {
        backgroundColor: colors.primary300,
        padding: 16,
        borderRadius: 24,
        maxWidth: "85%",
        alignSelf: "flex-start",
        marginTop: -1,
    },
    pointer: {
        width: 0,
        height: 0,
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderBottomWidth: 16,
        borderStyle: "solid",
        backgroundColor: "transparent",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: colors.primary300, // same as bubble background
        marginLeft: 20, // move pointer horizontally
    },
    overlay: {
        backgroundColor: colors.primary300,
        padding: 16,
        borderRadius: 24,
        maxWidth: "85%",
        alignSelf: "flex-start",
        marginTop: -1,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 6,
        color: "white",
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 21,
        color: "white",
        marginBottom: 12,
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#C3C2C8',
    },
    button: {
        marginTop: 6,
        alignSelf: "flex-end",
        backgroundColor: "rgba(255,255,255,0.3)",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
    },
});