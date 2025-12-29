import { ThemedButtonProps } from "@/types/ComponentTypes";
import React from "react";
import { Pressable, Text } from "react-native";

const ThemedButton = ({ className, title, ...props }: ThemedButtonProps) => {
    return (
        <Pressable className={`bg-blue-500 p-3 rounded-lg items-center ${className || ""}`} {...props}>
            <Text className="text-white font-semibold">
                {title}
            </Text>
        </Pressable>
    );
};