import AddCollectionModal from '@/components/AddModal';
import BackButton from '@/components/BackButton';
import NavBar from '@/components/NavBar';
import ResultModal from '@/components/ResultModal';
import CollectionScreenOverlay from '@/components/walkthrough/CollectionScreenOverlay';
import { useNav } from '@/context/NavContext';
import { colors, fontSizes, spacing } from '@/global/theme';
import { getMyCollections } from '@/services/api';
import { ApiResponse, Collection } from '@/types/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useWalkthroughStep } from 'react-native-interactive-walkthrough';
import Animated, { FadeInLeft, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate } from 'expo-router/build/global-state/routing';

type LocalCollection = {
    id: string,
    name: string,
    wordCount: number;
};

// const collections: LocalCollection[] = [
//     { id: 'randomstring', name: 'Tất cả từ đã lưu', wordCount: 12 },
//     // { id: 'randomstring1', name: 'Y tế', wordCount: 4, tag: 'y_te' },
//     // { id: 'randomstring3', name: 'fafa', wordCount: 6, tag: 'fafa' },
// ];

const Collections = () => {
    const { activeTab, setActiveTab } = useNav();

    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCollectionVisible, setIsCollectionVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [resultState, setResultState] = useState<"add" | "save" | "delete">("save");

    const params = useLocalSearchParams();

    useEffect(() => {
        if (params?.deleted === "true") {
            setResultState("delete");
            setIsResultVisible(true);

            router.setParams({ deleted: undefined });
        }
    }, [params]);

    // useEffect(() => {
    //     const fetchCollections = async (): Promise<void> => {
    //         setIsLoading(true);

    //         try {
    //             let token = await AsyncStorage.getItem("userToken");
    //             if (token == null) throw new Error("Thiếu token");

    //             let res: ApiResponse<Collection[]> = await getMyCollections(token);
    //             setCollections(res.data);
    //         } catch (err: any) {
    //             console.log(err.message);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchCollections();
    // }, []);
    useFocusEffect(
        useCallback(() => {
            const fetchCollections = async (): Promise<void> => {
                setIsLoading(true);
                try {
                    let token = await AsyncStorage.getItem("userToken");
                    if (token == null) throw new Error("Thiếu token");

                    let res: ApiResponse<Collection[]> = await getMyCollections(token);
                    setCollections(res.data);
                } catch (err: any) {
                    console.log(err.message);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchCollections();
        }, [])
    );

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <View style={{
                        paddingHorizontal: spacing.md,
                        marginTop: spacing.lg,
                        alignSelf: 'center'
                    }}>
                        {/* <BackButton color={colors.gray50} /> */}
                        <BackButton color={colors.gray300} onPress={() => navigate("/(dictionary)")} />
                    </View>
                </View>

                <Animated.View
                    style={styles.searchContainer}
                    entering={FadeInLeft.duration(500).springify()}
                >
                    <Text
                        style={{
                            paddingHorizontal: spacing.md,
                            fontSize: fontSizes['2xl'],
                            fontWeight: 700,
                            color: colors.gray50
                        }}>
                        Ký hiệu đã lưu
                    </Text>
                    <Pressable
                        onPressIn={() => { scale.value = withSpring(0.95); }}
                        onPressOut={() => { scale.value = withSpring(1); }}
                        style={{ paddingHorizontal: spacing.md, marginTop: spacing.md * 1.4 }}
                        onPress={() => setIsAddModalVisible(true)}
                    >

                        <Animated.View style={[
                            styles.buttonStyle,
                            animatedStyle]}
                        >
                            <Text style={[styles.addNewText]}>
                                + Tạo bộ sưu tập mới
                            </Text>
                        </Animated.View>
                    </Pressable>
                </Animated.View>

                <View style={styles.main}>
                    <FlatList
                        style={{
                            marginTop: 20,
                            marginHorizontal: spacing.lg,
                        }}
                        data={collections}
                        keyExtractor={(item) => item.collectionId}
                        renderItem={({ item, index }) => (
                            <Animated.View
                                //onLayout={index === 0 ? step13OnLayout : undefined}
                                entering={FadeInUp.delay(100 * index).duration(200)}
                                style={styles.card}
                            >
                                <TouchableOpacity
                                    style={styles.searchItem}
                                    onPress={() => {
                                        router.push(`./collection/${item.collectionId}`);
                                    }}
                                >
                                    <Text style={{
                                        fontSize: fontSizes.lg,
                                        color: colors.primary600,
                                        fontWeight: 500,
                                        textAlign: 'center',
                                        flex: 1,
                                    }}>
                                        {item.name} ({item.signWords.length} từ)
                                    </Text>

                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    />
                </View>
                <NavBar />
            </View>

            <ResultModal
                visible={isResultVisible}
                onClose={() => setIsResultVisible(false)}
                state={resultState}
            />

            {/* <AddCollectionModal
                isVisible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                onAdd={() => {
                    setIsAddModalVisible(false);
                    setResultState("add");
                    setIsResultVisible(true);
                }}
            /> */}
            <AddCollectionModal
                isVisible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                onAdd={async () => {
                    setIsAddModalVisible(false);
                    setResultState("add");
                    setIsResultVisible(true);

                    // gọi lại API để update danh sách
                    try {
                        setIsLoading(true);
                        let token = await AsyncStorage.getItem("userToken");
                        if (token == null) throw new Error("Thiếu token");

                        let res: ApiResponse<Collection[]> = await getMyCollections(token);
                        setCollections(res.data);
                    } catch (err: any) {
                        console.log("Lỗi khi fetch sau add:", err.message);
                    } finally {
                        setIsLoading(false);
                    }
                }}
            />

        </SafeAreaView>
    );
};

export default Collections;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2C6AEF"
    },
    searchContainer: {
        flex: 1,
        paddingHorizontal: spacing.sm,
        marginTop: spacing.sm
    },
    main: {
        //flex: 3,
        flex: 5,
        borderRadius: 60,
        backgroundColor: colors.gray50,
        // gray50: #FDFDFE
        paddingTop: spacing.md,
        paddingHorizontal: spacing.md,
        gap: spacing.lg
    },
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: spacing.sm,
        borderRadius: 5,
        backgroundColor: '#4B7FF2',
        borderWidth: 1,
        marginBottom: spacing.sm,
        borderStyle: "dashed",
        borderColor: colors.gray400,
    },
    addNewText: {
        textAlign: "center",
        color: colors.gray100,
        fontWeight: "bold",
        fontSize: fontSizes.md,
        zIndex: 999,
    },
    card: {
        backgroundColor: colors.gray50,
        borderRadius: 10,
        borderWidth: .5,
        borderColor: colors.gray400,
        marginBottom: 10,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,

        elevation: 2,
    },
    searchItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: spacing.md,

    }
});