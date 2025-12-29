import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IOverlayComponentProps } from 'react-native-interactive-walkthrough';
import AnimatedTyping from '../animation/AnimatedTyping';
import { colors, fontSizes, spacing } from '@/global/theme';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const WelcomeMessageOverlay = ({ next }: IOverlayComponentProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));


    return (
        <SafeAreaView style={styles.fullScreenContainer}>
            <View style={styles.overlayBackground} />
            <View style={{ paddingHorizontal: spacing.md * 2, paddingVertical: spacing.lg }}>
                <AnimatedTyping
                    textToType={["Chào mừng bạn đến với Silent Talk!"]}
                    displayLogo={false}
                />
            </View>

            <Animated.View
                style={{ paddingHorizontal: spacing.md * 2 }}
                entering={FadeInDown.delay(3000).duration(500).springify()}
            >
                <Text style={styles.subtitle}>
                    Hãy cùng khám phá nhanh các tính năng chính của ứng dụng nhé.
                </Text>
            </Animated.View>
            <Animated.View
                style={{
                    paddingHorizontal: spacing.md * 2,
                    marginTop: spacing.sm,
                    alignItems: "center",
                }}
                entering={FadeInDown.delay(3500).duration(500).springify()}
            >
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
                            Bắt đầu
                        </Text>
                    </Animated.View>
                </Pressable>
            </Animated.View>
        </SafeAreaView>
    );
};

export default WelcomeMessageOverlay;
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
    subtitle: {
        fontSize: fontSizes.md,
        color: colors.gray400,
        marginBottom: 20,
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