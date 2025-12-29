import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { colors } from '@/global/theme';
import { useWalkthroughStep } from 'react-native-interactive-walkthrough';
import WordOfTheDayButtonOverlay from '../walkthrough/HomeScreenOverlay3';

export const APP_ICON_SIZE = 12;
const size = APP_ICON_SIZE * 2;
const BUTTON_SIZE = size * 1.5;

const AnimatedComponent = Animated.createAnimatedComponent(ChevronRight);

type Props = {
    primary?: string,
    accent?: string,
    onPress: () => void;
};

const AnimateChveron = ({ onPress }: Props) => {
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
        <TouchableOpacity
            style={{ ...styles.iconContainer, backgroundColor: buttonPressed ? colors.primary400 : 'transparent' }}
            onPress={onPress}
        >
            <AnimatedComponent
                size={size}
                style={animatedStyle}
                color={buttonPressed ? colors.gray50 : colors.primary400}
            />
        </TouchableOpacity >
    );
};

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

export default AnimateChveron;