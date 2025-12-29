import { colors, spacing } from "@/global/theme";
import LottieView from "lottie-react-native";
import { Check } from "lucide-react-native";
import React, { useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, TouchableWithoutFeedback } from "react-native";

const titles: Record<Props["state"], string> = {
    add: "Tạo thành công!",
    save: "Lưu thành công!",
    move: "Di chuyển thành công!",
    delete: "Xóa thành công!",
    payment: "Thanh toán thành công!",
    unsave: "Bỏ lưu thành công!",
    register: "Đăng ký thành công!"
};

type Props = {
    visible: boolean;
    onClose: () => void;
    state: "add" | "save" | "move" | "delete" | "payment" | "unsave" | "register";
};

const ResultModal = ({ visible, onClose, state }: Props) => {
    const isAdd = state === "add";

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (visible) {
            timer = setTimeout(() => {
                onClose();
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [visible]);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
        >
            <TouchableWithoutFeedback onPress={() => {
                onClose();
            }}>
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        {/* <Text style={styles.title}>
                            {isAdd ? "Tạo thành công!" : "Lưu thành công!"}
                        </Text> */}
                        <Text style={styles.title}>{titles[state]}</Text>

                        {/* <View style={styles.checkBtn}> */}
                        {/* <Check size={50} strokeWidth={4} color={colors.gray50} /> */}
                        <LottieView
                            source={require('@/assets/lottie/success.json')}
                            autoPlay
                            style={{ width: 150, height: 150, alignSelf: 'center' }}
                        />
                        {/* </View> */}

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
        paddingVertical: spacing.md,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        textAlign: 'center'
    },
    checkBtn: {
        padding: 15,
        alignSelf: 'center',
        backgroundColor: colors.primary700,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default ResultModal;
