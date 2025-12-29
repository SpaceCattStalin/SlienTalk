import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IOverlayComponentProps } from 'react-native-interactive-walkthrough';
import AnimatedTyping from '../animation/AnimatedTyping';
import { colors, fontSizes, spacing } from '@/global/theme';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';

const EndingMessageOverlay = ({ stop }: IOverlayComponentProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));


    return (
        <SafeAreaView style={styles.fullScreenContainer}>
            <View style={styles.overlayBackground} />

            <Animated.View
                style={{ paddingHorizontal: spacing.md * 2 }}
                entering={FadeInDown.delay(300).duration(500).springify()}
            >
                <Text style={styles.title}>🎉 Bạn đã sẵn sàng!</Text>
            </Animated.View>
            <Animated.View
                style={{ paddingHorizontal: spacing.md * 2 }}
                entering={FadeInDown.delay(400).duration(500).springify()}
            >
                <Text style={styles.subtitle}>
                    Hãy bắt đầu thôi nào!
                </Text>
            </Animated.View>

            <Animated.View
                style={{
                    paddingHorizontal: spacing.md * 2,
                    marginTop: spacing.sm,
                    alignItems: "center",
                }}
                entering={FadeInDown.delay(500).duration(500).springify()}
            >
                <Pressable
                    onPressIn={() => { scale.value = withSpring(0.95); }}
                    onPressOut={() => { scale.value = withSpring(1); }}
                    onPress={stop}
                >
                    <Animated.View style={[
                        styles.button,
                        animatedStyle]}
                    >
                        <Text style={styles.buttonText}>
                            Bắt đầu
                        </Text>
                    </Animated.View>
                </Pressable>
            </Animated.View>
            <ConfettiCannon count={200}
                origin={{ x: -10, y: 0 }}
                fallSpeed={4000}
                autoStart={true}
                fadeOut={true}
            />
        </SafeAreaView>
    );
};

export default EndingMessageOverlay;
const styles = StyleSheet.create({
    fullScreenContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
    },
    overlayBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 12,
        color: colors.gray50,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: fontSizes.lg,
        color: colors.gray400,
        marginBottom: 20,
        paddingStart: spacing.lg * 2, 
        lineHeight: 22,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignItems: "center",
        backgroundColor: "#2C6AEF",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});