import React, { ReactNode } from "react";
import { Pressable, StyleProp, Text, ViewStyle } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from "react-native-reanimated";

type Props = {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
};

export default function AnimatedButton({ children, onPress, style }: Props) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));
    return (
        // <Pressable
        //     onPressIn={() => {
        //         scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
        //     }}
        //     onPressOut={() => {
        //         scale.value = withSpring(1, { damping: 10, stiffness: 200 });
        //     }}
        //     onPress={onPress}
        //     style={style}
        // >
        //     <Animated.View style={[animatedStyle]}>
        //         {children}
        //     </Animated.View>
        // </Pressable>
        <Pressable
            onPressIn={() => { scale.value = withSpring(0.95); }}
            onPressOut={() => { scale.value = withSpring(1); }}
            onPress={onPress}
            style={style}
        >
            <Animated.View style={[animatedStyle]}>
                {children}
            </Animated.View>
        </Pressable>
    );
}
