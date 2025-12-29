import { ThemedTextProps } from "@/types/ComponentTypes";
import React from "react";
import { Text } from "react-native";

const ThemedText = ({ className, ...props }: ThemedTextProps) => {
    return (
        <Text className={`text-black ${className || ""}`} {...props} />
    );
};

export default ThemedText;