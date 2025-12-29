import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { IOverlayComponentProps } from 'react-native-interactive-walkthrough';
import { colors } from '@/global/theme';
import Animated, { FadeInDown, FadeOutUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const DictionaryCategoryOverlay = ({
    next,
    step: { mask },
}: IOverlayComponentProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <View
            style={{ ...styles.container, top: mask.y - mask.height, left: 50 }}
        >
            <View style={styles.overlay}>
                <Text style={styles.title}>Tìm kiếm</Text>
                <Text style={styles.subtitle}>
                    Hay bạn có thể tìm kiếm theo chủ đề có sẵn!
                </Text>

                <Pressable
                    onPressIn={() => { scale.value = withSpring(0.95); }}
                    onPressOut={() => { scale.value = withSpring(1); }}
                    onPress={next}
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
            <View style={styles.pointer} />

        </View>
    );
};

export default DictionaryCategoryOverlay;

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
        borderTopWidth: 16,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: colors.primary300,
        marginLeft: 20,
        marginTop: -1
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
