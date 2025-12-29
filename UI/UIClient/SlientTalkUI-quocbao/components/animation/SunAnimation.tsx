import React, { useEffect, useMemo } from "react";
import { Dimensions, View } from "react-native";
import Animated, { Easing, useAnimatedProps, useSharedValue, withRepeat, withSpring, withTiming } from "react-native-reanimated";
import Svg, { Circle, Line } from "react-native-svg";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

const rayLength = 10;
const raysCount = 9;
const staticSunRadius = 40;

function generateRays(radius: number, rayLength: number, count: number) {
    return Array.from({ length: count }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / count;
        return {
            x1: radius * Math.cos(angle),
            y1: radius * Math.sin(angle),
            x2: (radius + rayLength) * Math.cos(angle),
            y2: (radius + rayLength) * Math.sin(angle),
        };
    });
}

export default function SunAnimation({ size = 120 }: { size?: number; }) {
    const sunRadius = useSharedValue(0.9);

    const bounce = useSharedValue(5);

    useEffect(() => {
        sunRadius.value = withRepeat(withTiming(1, { duration: 1500, easing }), -1, true);
        // sunRadius.value = withRepeat(withSpring(1, { damping: 5, stiffness: 50 }), -1, true);
        bounce.value = withRepeat(withSpring(8, { duration: 1500, dampingRatio: 1.5 }), -1, true);
    }, [bounce, sunRadius]);

    const rays = useMemo(() => generateRays(staticSunRadius, rayLength, raysCount), []);

    const y1Line1 = useSharedValue(rays[0].y1);
    const y2Line1 = useSharedValue(rays[0].y2);

    const y1Line2 = useSharedValue(rays[1].y1);
    const y2Line2 = useSharedValue(rays[1].y2);

    const y1Line3 = useSharedValue(rays[2].y1);
    const y2Line3 = useSharedValue(rays[2].y2);


    const circleProps = useAnimatedProps(() => ({
        fill: "#FFD93B",
        cx: 0,
        cy: 0,
        r: sunRadius.value * 35
    }));

    const animatedProps1 = useAnimatedProps(() => {
        return {
            y1: y1Line1.value + bounce.value,
            y2: y2Line1.value + bounce.value,
        };
    });

    const animatedProps2 = useAnimatedProps(() => {
        return {
            y1: y1Line2.value + bounce.value,
            y2: y2Line2.value + bounce.value,
        };
    });


    const animatedProps3 = useAnimatedProps(() => {
        return {
            y1: y1Line3.value + bounce.value,
            y2: y2Line3.value + bounce.value,
        };
    });

    return (
        <View style={{ width: size, height: size, position: "absolute", top: 20 }}>
            <Svg width="100%" height="100%" viewBox="0 0 100 100" >
                <AnimatedCircle
                    animatedProps={circleProps} />
                <AnimatedLine
                    animatedProps={animatedProps1}
                    x1={rays[0].x1}
                    x2={rays[0].x2}
                    stroke="#FFD93B"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <AnimatedLine
                    animatedProps={animatedProps2}
                    x1={rays[1].x1}
                    x2={rays[1].x2}
                    stroke="#FFD93B"
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                <AnimatedLine
                    animatedProps={animatedProps3}
                    x1={rays[2].x1}
                    x2={rays[2].x2}
                    stroke="#FFD93B"
                    strokeWidth="3"
                    strokeLinecap="round"
                />

            </Svg >
        </View>
    );
};