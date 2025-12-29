import React, { useState, useContext } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import { addWordToCollection, createCollection } from "@/services/api";
import { AuthContext } from "@/context/AuthProvider";
import { Collection } from "@/types/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
    isVisible: boolean;
    onCancel: () => void;
    onAdd: () => void;
    signWordId?: string;
    onError?: (message: string) => void;
};

const AddCollectionModal = ({ isVisible, onCancel, onAdd, signWordId, onError }: Props) => {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) return;

        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) throw new Error("Missing access token");

            const createRes = await createCollection(token, {
                name: name.trim(),
                isDefault: false,
            });

            const collection = createRes.data;

            if (signWordId && signWordId !== "") {
                await addWordToCollection(token, {
                    collectionId: collection.collectionId,
                    signWordId: signWordId,
                });
            }

            onAdd();
            onCancel();
            setName("");
        } catch (err: any) {
            //console.error("Error creating or linking collection:", err.message);
            if (onError) {
                const msg = err.response?.data?.errorMessage;
                onError(msg);
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={() => {
                if (!isLoading) {
                    onCancel();
                    setName("");
                }
            }}>
                <View style={styles.backdrop}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Tạo bộ sưu tập mới</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Tên bộ sưu tập"
                            value={name}
                            onChangeText={setName}
                            editable={!isLoading}
                        />

                        <View style={styles.buttonsRow}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancel]}
                                onPress={() => {
                                    onCancel();
                                    setName("");
                                }}
                                disabled={isLoading}
                            >
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.confirm]}
                                onPress={handleCreate}
                                disabled={isLoading}
                            >
                                <Text style={styles.buttonText}>Tạo</Text>
                            </TouchableOpacity>
                        </View>

                        {isLoading && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color="#fff" />
                            </View>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        position: "relative",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    buttonsRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    cancel: {
        backgroundColor: "#ccc",
    },
    confirm: {
        backgroundColor: "#007bff",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
    },
});

export default AddCollectionModal;
