import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { colors, fontSizes, spacing } from "@/global/theme";
import React from "react";

type Props = {
    title: string,
    onPress: () => void;
};

const PrimaryButton = ({ title, onPress } : Props) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

export default PrimaryButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#2463C9',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: spacing.lg,

        // iOS shadow
        shadowColor: "#0B3478",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 4,
    },
    text: {
        color: "white",
        fontSize: fontSizes.lg,
        fontWeight: "600",
        textAlign: "center",
    },
});
