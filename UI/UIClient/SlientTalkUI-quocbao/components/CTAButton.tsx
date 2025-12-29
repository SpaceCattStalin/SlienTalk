import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons'; // hoặc react-native-vector-icons
import { colors, fontSizes, spacing } from '@/global/theme';

const CTAButton = () => {
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);

    useEffect(() => {
        translateY.value = withRepeat(
            withTiming(-2, {
                duration: 600,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );

        translateX.value = withRepeat(
            withTiming(2, {
                duration: 600,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );
    }, []);

    const textStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const iconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <TouchableOpacity style={styles.cta}>
            <Text style={{ fontSize: fontSizes.xl, fontWeight: 700, color: colors.gray50 }}>Xem các từ đã lưu</Text>
            {/* <Animated.Text style={[styles.text, textStyle]}>
                Xem các ký hiệu đã lưu
            </Animated.Text> */}
            <Animated.View style={iconStyle}>
                <Ionicons name="arrow-forward" size={30} color="#333" />
            </Animated.View>
        </TouchableOpacity>
    );
};

export default CTAButton;

const styles = StyleSheet.create({
    cta: {
        borderWidth: 1.5,
        borderColor: colors.primary700,
        borderRadius: 999,
        padding: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        color: colors.gray50,
        textDecorationLine: 'underline',
        fontSize: fontSizes.md,
        fontWeight: '500',
        marginRight: 6,
    },
});
