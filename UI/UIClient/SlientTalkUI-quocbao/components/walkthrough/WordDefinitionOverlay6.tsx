import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '@/global/theme';
import Animated, { FadeInDown, FadeOutUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { IOverlayComponentProps } from 'react-native-interactive-walkthrough';
import { router } from 'expo-router';

const WordDefinition6Overlay = ({
    next,
    stop,
    step: { mask },
}: IOverlayComponentProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View
            style={{
                ...styles.container,
                top: mask.y - mask.height - 40,
                left: 100
            }}
            entering={FadeInDown.duration(200)}
            exiting={FadeOutUp.duration(100)}
        >
            <View style={styles.overlay}>
                <Text style={styles.subtitle}>
                    Bạn cũng có thể tra các ký hiệu khác qua tính năng Từ điển
                </Text>
            </View>
            <View style={styles.pointer} />

        </Animated.View>
    );
};

export default WordDefinition6Overlay;

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
        borderStyle: "solid",
        backgroundColor: "transparent",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: colors.primary300, // same as bubble background
        marginLeft: 70, // move pointer horizontally
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