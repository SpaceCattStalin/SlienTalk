import { colors, spacing } from "@/global/theme";
import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableWithoutFeedback,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

type WordOptionsModalProps = {
    visible: boolean;
    onClose: () => void;
    onMove: () => void;
    onDelete: () => void;
};

const WordOptionsModal = ({ visible, onClose, onMove, onDelete }: WordOptionsModalProps) => {
    const moveScale = useSharedValue(1);
    const deleteScale = useSharedValue(1);

    const moveAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: moveScale.value }],
    }));

    const deleteAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: deleteScale.value }],
    }));

    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
        >
            <TouchableWithoutFeedback
                onPress={() => {
                    onClose();
                }}>
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>

                        <Pressable
                            onPressIn={() => { moveScale.value = withSpring(0.95); }}
                            onPressOut={() => { moveScale.value = withSpring(1); }}
                            onPress={onMove}
                        >
                            <Animated.View style={[
                                styles.moveButton,
                                moveAnimatedStyle]}
                            >
                                <Text style={styles.moveText}>
                                    Di chuyển tới bộ sưu tập khác
                                </Text>
                            </Animated.View>
                        </Pressable>
                        <Pressable
                            onPressIn={() => { deleteScale.value = withSpring(0.95); }}
                            onPressOut={() => { deleteScale.value = withSpring(1); }}
                            onPress={onDelete}
                        >
                            <Animated.View style={[
                                styles.deleteButton,
                                deleteAnimatedStyle]}
                            >
                                <Text style={styles.deleteText}>
                                    Bỏ thích từ này
                                </Text>
                            </Animated.View>
                        </Pressable>

                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal >
    );
};

export default WordOptionsModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 24,
        justifyContent: 'center',
        gap: spacing.sm,
        alignItems: "stretch",
    },
    moveButton: {
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: "center",
        width: "100%",
        backgroundColor: colors.primary600,
    },
    deleteButton: {
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: "center",
        width: "100%",
        backgroundColor: colors.red500,
    },
    moveText: {
        color: "#fff",
        fontWeight: "600",
    },
    deleteText: {
        color: "#fff",
        fontWeight: "600",
    },
    cancelArea: {
        marginTop: 10,
    },
});
