import React from "react";
import Animated, { useAnimatedProps } from "react-native-reanimated";
import { TextInput, TextInputProps } from "react-native";
import { colors, fontSizes } from "@/global/theme";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type AnimatedTextProps = {
    progress: Animated.SharedValue<number>;
    max: number;
    style?: TextInputProps["style"];
};

const AnimatedText = ({ progress, max, style }: AnimatedTextProps) => {
    const animatedProps = useAnimatedProps(() => {
        return {
            text: `(${progress.value}/${max} từ)`,
            defaultValue: `(${progress.value}/${max} từ)`,
        } as any;
    });

    return (
        <AnimatedTextInput
            editable={false}
            underlineColorAndroid="transparent"
            style={[{
                textAlign: "center",
                color: colors.primary700,
                fontSize: fontSizes.md,
                fontWeight: 600
            }, style]}
            animatedProps={animatedProps}
        />
    );
};

export default AnimatedText;
