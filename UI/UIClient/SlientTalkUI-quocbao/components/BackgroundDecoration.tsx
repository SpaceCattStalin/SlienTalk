import { StyleSheet, View, Image, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import Decor1 from '@/assets/images/decor_1.svg';
import Decor2 from '@/assets/images/decor_2.svg';

const BackgroundDecoration = () => {
    const decor1Y = useSharedValue(0);
    const decor2Y = useSharedValue(0);

    useEffect(() => {
        decor1Y.value = withRepeat(
            withTiming(-15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            -1, // infinite
            true // reverse
        );
        decor2Y.value = withRepeat(
            withTiming(-15, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const decor1Style = useAnimatedStyle(() => ({
        transform: [{ translateY: decor1Y.value }],
    }));

    const decor2Style = useAnimatedStyle(() => ({
        transform: [{ translateY: decor2Y.value }],
    }));

    return (
        <View style={styles.main}>

            <Animated.View style={[styles.decor_1, decor1Style]}>
                <Decor1 width={100} height={100} />
            </Animated.View>

            <Animated.View style={[styles.decor_2, decor2Style]}>
                <Decor2 width={70} height={70} />
            </Animated.View>
        </View>
    );
};

export default BackgroundDecoration;

const styles = StyleSheet.create({
    main: {
        position: "absolute",
        width: "100%",
        height: "100%"
        // zIndex: -1
    },
    decor_1: {
        position: "absolute",
        right: 6,
        aspectRatio: 1,
        // top: "40%"
        top: 80
    },
    decor_2: {
        position: "absolute",
        right: 2,
        aspectRatio: 1,
        // top: "40%"
        top: 140
    },
    ellipse_1: {
        position: "absolute",
        bottom: 0,
        left: 0,
        aspectRatio: 1
    },
    ellipse_2: {
        position: "absolute",
        bottom: 0,
        right: 0,
        aspectRatio: 1
    },
});