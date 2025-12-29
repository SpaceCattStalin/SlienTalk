import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '@/global/theme';
import Animated, { FadeInDown, FadeOutUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { IOverlayComponentProps } from 'react-native-interactive-walkthrough';
import { router } from 'expo-router';
type Props = IOverlayComponentProps & {
    onContinue?: () => void;
};

const WordDefinitionAddCollectionOverlay = ({
    next,
    onContinue,
    step: { mask },
}: Props) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));
    const handlePress = () => {
        if (onContinue) {
            onContinue(); 
        }
        next();
    };

    return (
        <Animated.View
            style={{
                ...styles.container,
                top: mask.y + mask.height,
                left: 100
            }}
            entering={FadeInDown.duration(200)}
            exiting={FadeOutUp.duration(100)}
        >
            <View style={styles.pointer} />
            <View style={styles.overlay}>
                <Text style={styles.subtitle}>
                    Hay tạo 1 bộ sưu tập mới để lưu
                </Text>
                <Pressable
                    onPressIn={() => { scale.value = withSpring(0.95); }}
                    onPressOut={() => { scale.value = withSpring(1); }}
                    onPress={() => {
                        handlePress();
                        //router.push("/(dictionary)");
                    }}
                >
                    <Animated.View style={[
                        styles.button,
                        animatedStyle]}
                    >
                        <Text style={styles.buttonText}>
                            Tiếp theo
                        </Text>
                    </Animated.View>
                </Pressable>
            </View>

        </Animated.View>
    );
};

export default WordDefinitionAddCollectionOverlay;

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-start",
        position: 'absolute'
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
        marginLeft: 40, // move pointer horizontally
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
        height: 50
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