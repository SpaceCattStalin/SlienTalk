import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { IOverlayComponentProps } from 'react-native-interactive-walkthrough';
import { colors } from '@/global/theme';
import Animated, { FadeInDown, FadeOutUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { router } from 'expo-router';

const DictionarySaveOverlay = ({
    next,
    step: { mask },
    stop
}: IOverlayComponentProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <View
            style={{
                ...styles.container,
                top: mask.y + mask.height + 10, right: -30
            }}
        >
            <View style={styles.pointer} />
            <View style={styles.overlay}>
                <Text style={styles.subtitle}>
                    Bạn có thể xem các ký hiệu đã lưu ở đây
                </Text>
                {/* <Pressable
                    onPressIn={() => { scale.value = withSpring(0.95); }}
                    onPressOut={() => { scale.value = withSpring(1); }}
                    onPress={() => {
                        next();
                        //router.push("/collections");
                        //stop();
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
                </Pressable> */}
            </View>
        </View>
    );
};

export default DictionarySaveOverlay;

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
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: colors.primary300,
        marginLeft: 220,
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
        height: 40
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
