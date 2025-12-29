import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { colors } from "@/global/theme"; // assuming you have color tokens
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

type FeedbackProps = {
    isCorrect: boolean | null;
    onContinue: () => void;
    isVisible: boolean;
};

const FeedbackPanel = ({ isCorrect, isVisible, onContinue }: FeedbackProps) => {
    const offsetY = useSharedValue(300);

    useEffect(() => {
        if (isVisible) {
            offsetY.value = withTiming(0, { duration: 300 });
        } else {
            offsetY.value = withTiming(300, { duration: 300 });
        }
    }, [isVisible, offsetY]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: offsetY.value }],
    }));

    if (isCorrect === null) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                animatedStyle,
                isCorrect ? styles.correctBackground : styles.incorrectBackground,
            ]}
        >
            <Text style={[styles.feedbackText, isCorrect ? styles.correctText : styles.incorrecText]}>
                {isCorrect ? "Đúng rồi!" : "Sai rồi"}
            </Text>


            <TouchableOpacity
                style={[
                    styles.continueBtn,
                    isCorrect ? styles.correctBtn : styles.incorrectBtn,
                ]}
                onPress={onContinue}
            >
                <Text style={styles.continueText}>Câu tiếp theo</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default FeedbackPanel;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    correctBackground: {
        backgroundColor: "#d4f8c4",
    },
    incorrectBackground: {
        backgroundColor: "#ffd6d6",
    },
    feedbackText: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: 'left',
        marginBottom: 12,
    },
    correctText: {
        color: colors.green600
    },
    incorrecText: {
        color: colors.red600
    },
    iconRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        width: "100%",
        marginBottom: 12,
    },
    continueBtn: {
        // width: "100%",
        // paddingVertical: 14,
        // borderRadius: 999,
        // alignItems: "center",
        // backgroundColor: colors.primary600,
        paddingVertical: 12,
        // paddingHorizontal: 32,
        flex: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: colors.primary700,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 3,

        elevation: 4,
    },
    correctBtn: {
        backgroundColor: colors.green400,
    },
    incorrectBtn: {
        backgroundColor: colors.red400,
    },
    continueText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        textTransform: "uppercase",
    },
});
