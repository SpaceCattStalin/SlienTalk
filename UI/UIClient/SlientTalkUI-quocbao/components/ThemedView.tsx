import { ThemedViewProps } from "@/types/ComponentTypes";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ThemedView = ({ className, children, safe = false, transparent = false, ...props }: ThemedViewProps) => {
    const insets = useSafeAreaInsets();
    const baseClass = transparent ? "bg-transparent" : "bg-white";

    if (!safe) {
        return (
            <View className={`${baseClass} ${className || ""}`} {...props}>
                {children}
            </View>
        );
    }

    return (
        <View
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
            className={`${baseClass} ${className || ""}`}
            {...props}
        >
            {children}
        </View>
    );
};


export default ThemedView;