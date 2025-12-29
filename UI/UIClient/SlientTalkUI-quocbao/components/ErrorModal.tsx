import { colors, spacing } from "@/global/theme";
import { XCircle } from "lucide-react-native";
import React, { useEffect } from "react";
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";

type Props = {
    visible: boolean;
    onClose: () => void;
    message: string; // the error message to show
    autoClose?: boolean; // default true
    duration?: number; // auto-close duration in ms
};

const ErrorModal = ({ visible, onClose, message, autoClose = true, duration = 1800 }: Props) => {

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (visible && autoClose) {
            timer = setTimeout(() => {
                onClose();
            }, duration);
        }
        return () => clearTimeout(timer);
    }, [visible, autoClose, duration]);

    return (
        <Modal transparent visible={visible} animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Lỗi</Text>
                        <Text style={styles.message}>{message}</Text>

                        <View style={styles.iconWrapper}>
                            <XCircle size={50} strokeWidth={4} color={colors.red600} />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: 15,
        width: "75%",
        elevation: 5,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.lg,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
        color: colors.red600,
        textAlign: "center",
    },
    message: {
        fontSize: 16,
        marginBottom: 12,
        textAlign: "center",
        color: colors.gray800,
        paddingHorizontal: spacing.md
    },
    iconWrapper: {
        padding: 15,
        backgroundColor: colors.red100,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default ErrorModal;
