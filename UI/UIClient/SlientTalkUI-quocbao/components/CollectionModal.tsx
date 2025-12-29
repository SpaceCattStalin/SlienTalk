//import React, { useEffect, useState } from "react";
import * as React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
//import Modal from "react-native-modal";
import HomeIcon from '@/assets/images/home.svg';
import Profile from '@/assets/images/profile.svg';
import Search from '@/assets/images/search.svg';
import { useNav } from "@/context/NavContext";
import { colors, fontSizes, spacing } from "@/global/theme";
import { Collection, GenericResponse } from "@/types/Types";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { useWalkthroughStep } from "react-native-interactive-walkthrough";
import WordDefinitionOverlay4 from "./walkthrough/WordDefinitionOverlay4";
import WordDefinitionOverlay5 from "./walkthrough/WordDefinitionOverlay5";
// import Wave from '@/assets/images/wave.svg';
import Scan from '@/assets/images/scan.svg';
import WordDefinitionOverlay6 from "./walkthrough/WordDefinitionOverlay6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addWordToCollection, getMyCollections } from "@/services/api";

type Props = {
    isVisible: boolean;
    onCancel: () => void;
    collections?: Collection[];
    onConfirm: (collectionId: string) => void;
    onAdd?: () => void;
    isMove?: boolean;
    inDictionary?: boolean;
    signWordId?: string;
    refetch?: boolean;
    onError?: (message: string) => void;
};
const ICON_SIZE = 20;

const CollectionModal = ({ isVisible, onCancel, onConfirm, onAdd, isMove = false, signWordId, refetch, onError }: Props) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [collections, setCollections] = useState<Collection[]>([]);

    const [newName, setNewName] = useState("");
    const { activeTab, setActiveTab } = useNav();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCollections = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem("userToken");
                if (!token) return;

                const res = await getMyCollections(token);
                if (res.isSuccess) {
                    const formatted = res.data.map((c: Collection) => ({ ...c, totalCount: c.signWords.length ?? 0 }));
                    setCollections(formatted);
                }
            } catch (err) {
                console.error("Failed to fetch collections:", err);
                if (onError) {
                    const msg = err.response?.data?.errorMessage;
                    onError(msg);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, [isVisible, refetch]);

    const handleConfirm = async () => {
        if (!selectedId) return;

        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) return;

            if (signWordId) {
                setLoading(true);
                const res = await addWordToCollection(token, {
                    collectionId: selectedId,
                    signWordId: signWordId,
                });
                if (res.isSuccess) {
                    // Refetch collections immediately
                    const collectionsRes = await getMyCollections(token);
                    if (collectionsRes.isSuccess) {
                        const formatted = collectionsRes.data.map((c: Collection) => ({
                            ...c,
                            totalCount: c.signWords.length ?? 0
                        }));
                        setCollections(formatted);
                    }
                } else {
                    console.error("Failed to add word:", res.errorMessage);
                }
            }

            // Always call parent onConfirm
            onConfirm(selectedId);
        } catch (error) {
            console.error("Error adding word to collection:", error);
        } finally {
            setLoading(false);
            setSelectedId(null);
        }
    };


    if (!isVisible) return null;

    const renderItem = ({ item }: { item: Collection; }) => {
        const isSelected = item.collectionId === selectedId;
        return (
            <TouchableOpacity
                style={[styles.collectionItem, isSelected && styles.selected]}
                onPress={() => {
                    if (selectedId === item.collectionId) {
                        setSelectedId(null);
                    } else {
                        setSelectedId(item.collectionId);
                    }
                }}
            >
                <Text style={[styles.collectionText, isSelected && styles.selectedText]}>
                    {item.name} ({item.totalCount} từ)
                    {/* ({item.signWords?.length}) */}
                </Text>

            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.overlayContainer}>

            <TouchableWithoutFeedback
                style={{
                    zIndex: 10
                }}
                onPress={() => {
                    onCancel();
                    setSelectedId(null);
                }}>
                <View
                    style={styles.backdrop}
                >
                    <View style={styles.container}>
                        <Text style={styles.title}>
                            {isMove ? "Di chuyển vào bộ sưu tập" : "Lưu vào bộ sưu tập"}
                        </Text>

                        <FlatList
                            //onLayout={step5OnLayout}
                            data={collections}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.collectionId}
                        />
                        {!isMove && <TouchableOpacity
                            style={[styles.collectionItem, styles.addNew]}
                            onPress={onAdd}
                        //onLayout={step6OnLayout}
                        >
                            <Text style={styles.addNewText}>+ Lưu vào bộ sưu tập mới</Text>
                        </TouchableOpacity>}

                        {selectedId && (
                            <View style={styles.buttonsRow}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancel]}
                                    onPress={() => {
                                        onCancel();
                                        setSelectedId(null);
                                    }}                                >
                                    <Text style={styles.buttonText}>Hủy</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.confirm]}
                                    onPress={handleConfirm}
                                >
                                    <Text style={styles.buttonText}>
                                        {isMove ? "Di chuyển" : "Lưu"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

export default CollectionModal;

const styles = StyleSheet.create({
    overlayContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 998,
        justifyContent: "center",
        alignItems: "center",
    },
    backdrop: {
        // flex: 1,
        // backgroundColor: "rgba(0,0,0,0.5)",
        // justifyContent: "center",
        // alignItems: "center",
        // zIndex: 10
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "85%",
        backgroundColor: "white",
        borderRadius: 15,
        elevation: 5,
        padding: spacing.md,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.primary700,
        marginBottom: spacing.md,
        textAlign: 'center'
    },
    collectionItem: {
        padding: spacing.sm,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: spacing.sm,
    },
    collectionText: {
        fontSize: 16,
        textAlign: 'center',
        color: colors.primary500,
        fontWeight: 400
    },
    selected: {
        backgroundColor: colors.primary100,
        borderColor: colors.primary300,
    },
    selectedText: {
        color: colors.primary500,
        fontWeight: "bold",
    },
    buttonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: spacing.md,
    },
    button: {
        flex: 1,
        padding: spacing.sm,
        marginHorizontal: spacing.xs,
        borderRadius: 10,
        alignItems: "center",
    },
    cancel: {
        backgroundColor: "#ccc",
    },
    confirm: {
        backgroundColor: colors.primary300,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    }, addContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: spacing.sm,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: spacing.sm,
        marginRight: spacing.xs,
    },
    addNew: {
        borderStyle: "dashed",
        borderColor: colors.primary300,
        backgroundColor: colors.primary100,
    },
    addNewText: {
        textAlign: "center",
        color: colors.primary700,
        fontWeight: "bold",
    }, containerNav: {
        width: '100%',
        flexDirection: 'row',
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        height: 70
    },

    translateBtn: {
        // position: 'relative',
        // bottom: 20,
        // backgroundColor: colors.gray50,
        // padding: spacing.sm,
        // borderRadius: 999,
        // borderColor: '#ddd',
        // borderWidth: 1
    },
    wrapper: {
        borderRadius: 10,
        padding: spacing.sm,
        justifyContent: "center",
        alignItems: 'center'
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "contain"
    },
    text: {
        fontSize: fontSizes.sm,
        fontWeight: 500
    },
    link: {
        position: 'absolute'
    }
});
