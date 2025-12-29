import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import Arrow from '@/assets/images/arrow.svg';
import { colors } from '@/global/theme';

const AnimatedArrow = Animated.createAnimatedComponent(Arrow);

const APP_ICON_SIZE = 12;
const size = APP_ICON_SIZE * 1.5;
const BUTTON_SIZE = APP_ICON_SIZE * 3.8;

type Props = {
    onPress: () => void;
};

const AnimatedArrowButton = ({ onPress }: Props) => {
    const offset = useSharedValue(0);
    const [buttonPressed, setButtonPressed] = useState(false);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: offset.value }]
        };
    }, []);

    useEffect(() => {
        offset.value = withRepeat(
            withTiming(2, {
                duration: 500,
                easing: Easing.sin,
            }),
            -1,
            true
        );
    }, [offset]);

    return (
        <Pressable
            style={{ ...styles.iconContainer, backgroundColor: buttonPressed ? colors.primary400 : 'transparent' }}
            onPress={() => {
                setButtonPressed(!buttonPressed);
                onPress();
            }}
        >
            <AnimatedArrow
                size={size}
                style={animatedStyle}
                color={buttonPressed ? colors.gray50 : colors.primary400}
            />
        </Pressable>
    );
};

export default AnimatedArrowButton;

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: BUTTON_SIZE * 1,
        height: BUTTON_SIZE * 1,
        borderColor: colors.primary400,
        borderWidth: 2,
        borderRadius: BUTTON_SIZE / 2,
    }
});