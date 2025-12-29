import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import React, { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import Svg from 'react-native-svg';


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

const CloudAnimation = ({ size = 120 }: { size?: number; }) => {
    const cloud1Pos = useSharedValue(0);

    useEffect(() => {
        cloud1Pos.value = withRepeat(withTiming(SCREEN_WIDTH, { duration: 1000 }), -1, false);
    }, [cloud1Pos]);0

    const animatedStyle1 = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: cloud1Pos.value }]
        };
    });


    return (
        <View style={{ width: "100%", height: size, position: "absolute", top: SCREEN_HEIGHT / 4 }}>
            <Svg width="100%" height="100%" viewBox="0 0 100 100">
                <Animated.View style={[{ position: 'absolute' }, animatedStyle1]}>
                    <Image source={require('@/assets/images/cloud.png')} />
                </Animated.View>
            </Svg>
        </View>
    );
};

export default CloudAnimation;