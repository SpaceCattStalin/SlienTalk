import React from "react";
import { TextInput, useColorScheme, View } from "react-native";
import { ThemedTextInputProps } from "@/types/ComponentTypes";
import clsx from "clsx";

const ThemedTextInput = ({ className, style, ...props }: ThemedTextInputProps) => {
    const colorScheme = useColorScheme();

    const isDark = colorScheme === "dark";

    return (
        <TextInput
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            className={clsx(
                isDark
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-black",
                className
            )}
            style={style}
            {...props}
        />
    );
};

export default ThemedTextInput;
