import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { colors, spacing } from "@/global/theme";

type ConfirmActionModalProps = {
  visible: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
};

const ConfirmActionModal = ({ visible, message, onCancel, onConfirm, cancelText = "Hủy bỏ",
  confirmText = "Xác nhận", }: ConfirmActionModalProps) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.message}>
              {/* Xác nhận xóa từ <Text style={styles.word}>“{word}” */}
              {message}
            </Text>

            <View style={styles.actions}>
              <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </Pressable>

              <Pressable style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
                <Text style={styles.confirmText}>{confirmText}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal >
  );
};

export default ConfirmActionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: spacing.md,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  word: {
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: colors.gray100,
  },
  confirmButton: {
    backgroundColor: colors.primary600,
  },
  cancelText: {
    color: colors.primary600,
    fontWeight: "600",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});
