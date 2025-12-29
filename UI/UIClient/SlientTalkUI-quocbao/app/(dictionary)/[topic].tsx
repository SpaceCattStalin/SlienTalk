import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, fontSizes, spacing } from "@/global/theme";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Search from "@/components/Searchbar";
import AnimatedLikeIcon from "@/components/animation/AnimatedLikeIcon";
import NavBar from "@/components/NavBar";
import ResultModal from "@/components/ResultModal";
import CollectionModal from "@/components/CollectionModal";
import AddCollectionModal from "@/components/AddModal";
import { Collection, SignWord, SignWordCategoryResponse } from "@/types/Types";
import BackButton from "@/components/BackButton";
import Animated, { FadeInLeft, FadeInUp } from "react-native-reanimated";
import { getWordsByCategory, removeWordFromCollections } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorModal from "@/components/ErrorModal";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import UpgradeModal from "@/components/UpgradeModal";
import { getUserLimit } from "@/services/userLimit";

export default function TopicDetailScreen() {
    const { topic } = useLocalSearchParams();
    const [wordsForTopic, setWordsForTopic] = useState<SignWord[]>([]);
    const [results, setResults] = useState<SignWord[]>([]);
    const [query, setQuery] = useState("");

    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    const [isCollectionVisible, setIsCollectionVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [confirmUnlikeVisible, setConfirmUnlikeVisible] = useState(false);
    const [wordPendingUnlike, setWordPendingUnlike] = useState<SignWord | null>(null);

    const [resultState, setResultState] = useState<"add" | "save" | "unsave">("save");
    const [limit, setLimit] = useState(10);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const router = useRouter();
    useEffect(() => {
        const loadLimit = async () => {
            const userLimit = await getUserLimit();
            setLimit(userLimit);
        };
        loadLimit();
    }, []);

    const fetchWords = useCallback(async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) throw new Error("Missing access token");

            const result: SignWordCategoryResponse = await getWordsByCategory(token, topic as string);
            if (result.isSuccess) {
                setWordsForTopic(result.data);
                setResults(result.data);
            } else {
                setWordsForTopic([]);
                setResults([]);
            }
        } catch (error) {
            console.log("Failed to fetch words for topic:", error);
            setWordsForTopic([]);
        } finally {
            setLoading(false);
        }
    }, [topic]);

    const showError = (msg: string) => {
        setErrorMessage(msg);
        setIsErrorVisible(true);
    };

    useEffect(() => {
        fetchWords();
    }, [fetchWords]);

    useEffect(() => {
        if (query.length > 0) {
            const filtered = wordsForTopic.filter((w) =>
                w.word.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        } else {
            setResults(wordsForTopic);
        }
    }, [query, wordsForTopic]);


    const handleToggleLike = (wordId: string) => {
        const word = results.find(w => w.signWordId === wordId);
        if (!word) return;

        setSelectedWordId(wordId);

        if (word.isInUserCollection) {
            // Already liked → show confirm modal
            setWordPendingUnlike(word);
            setConfirmUnlikeVisible(true);
            return;
        }
        const savedWords = wordsForTopic.filter(w => w.isInUserCollection).length;

        if (savedWords >= limit) {
            setShowUpgradeModal(true);
            return;
        }

        if (savedWords >= limit - 2) {
            setShowUpgradeModal(true);
        }
        if (savedWords === 5) {
            setShowUpgradeModal(true);
        }

        if (savedWords === 3) {
            setShowUpgradeModal(true);
        }


        if (savedWords === 1) {
            setShowUpgradeModal(true);
        }

        setIsCollectionVisible(true);

        setResults(prev => prev.map(item =>
            item.signWordId === wordId
                ? { ...item, isInUserCollection: !item.isInUserCollection }
                : item
        ));

        setWordsForTopic(prev => prev.map(item =>
            item.signWordId === wordId
                ? { ...item, isInUserCollection: !item.isInUserCollection }
                : item
        ));

        setIsCollectionVisible(true);
    };

    const handleUnlikeWordFromCollection = async () => {
        if (!wordPendingUnlike) return;

        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                showError("Bạn chưa đăng nhập");
                return;
            }

            await removeWordFromCollections(token, {
                collectionId: "",
                signWordId: wordPendingUnlike.signWordId,
            });

            // Update state: set isInUserCollection = false cho từ vừa bỏ
            setResults(prev => prev.map(item =>
                item.signWordId === wordPendingUnlike.signWordId
                    ? { ...item, isInUserCollection: false }
                    : item
            ));
            setWordsForTopic(prev => prev.map(item =>
                item.signWordId === wordPendingUnlike.signWordId
                    ? { ...item, isInUserCollection: false }
                    : item
            ));
            setResultState('unsave');
            setIsResultVisible(true);
        } catch (err) {
            console.log("Failed to remove word:", err);
            showError("Có lỗi khi bỏ thích từ này");
        } finally {
            setConfirmUnlikeVisible(false);
            setWordPendingUnlike(null);
        }
    };

    const handleCancelAddToCollection = () => {
        if (!selectedWordId) return;

        setResults(prev => prev.map(item =>
            item.signWordId === selectedWordId
                ? { ...item, isInUserCollection: false }
                : item
        ));

        setWordsForTopic(prev => prev.map(item =>
            item.signWordId === selectedWordId
                ? { ...item, isInUserCollection: false }
                : item
        ));

        setIsCollectionVisible(false);
        setIsAddModalVisible(false);
        setSelectedWordId(null);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1 }}>
                    <View style={styles.searchContainer}>
                        <View style={{ marginLeft: spacing.sm, marginBottom: spacing.sm }}>
                            <BackButton color={colors.gray50} />
                        </View>
                        <Animated.View
                            entering={FadeInLeft.duration(500).springify()}
                        >
                            <Text
                                style={{
                                    paddingHorizontal: spacing.md,
                                    fontSize: fontSizes.xl,
                                    fontWeight: 700,
                                    color: colors.gray50
                                }}>
                                Tìm kiếm trong chủ đề &quot;{topic}&quot;
                            </Text>
                        </Animated.View>
                        <Animated.View
                            entering={FadeInLeft.delay(200).duration(500).springify()}
                        >
                            <Search value={query} onChange={setQuery} />
                        </Animated.View>
                    </View>

                    <View style={styles.main}>

                        {loading ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="large" color={colors.primary600} />
                                <Text style={{ color: colors.primary600, marginTop: 8 }}>Đang tải...</Text>
                            </View>
                        ) : (
                            wordsForTopic.length > 0 ? (
                                <View style={{ paddingBottom: 90 }}>
                                    <FlatList
                                        style={{ marginTop: 10 }}
                                        data={results}
                                        keyExtractor={(item: SignWord) => item.signWordId}
                                        renderItem={({ item, index }: { item: SignWord, index: number; }) => (
                                            <Animated.View
                                                entering={FadeInUp.delay(100 * index).duration(200)}
                                                style={styles.card}
                                            >
                                                <TouchableOpacity
                                                    style={styles.searchItem}
                                                    onPress={() => {
                                                        router.push(`./word/${encodeURIComponent(item.signWordId)}`);
                                                    }}                                            >
                                                    <Text style={{
                                                        fontSize: fontSizes.lg,
                                                        color: colors.primary600,
                                                        fontWeight: '500'
                                                    }}>
                                                        {item.word}
                                                    </Text>
                                                    <View style={{ flexDirection: 'row', gap: spacing.xs, alignItems: 'center' }}>
                                                        <AnimatedLikeIcon
                                                            isLiked={item.isInUserCollection}
                                                            accent='transparent'
                                                            primary={colors.primary600}
                                                            // onPress={() => {
                                                            //     setIsCollectionVisible(true);
                                                            //     setSelectedWordId(item.signWordId);
                                                            // }}
                                                            onPress={() => {
                                                                handleToggleLike(item.signWordId);
                                                                setSelectedWord(item.word);
                                                            }}
                                                        />
                                                        <ChevronRight color={colors.primary700} size={28} />
                                                    </View>
                                                </TouchableOpacity>
                                            </Animated.View>
                                        )}
                                    />
                                </View>
                            ) : (
                                <View style={{ flex: 1, gap: spacing.md, justifyContent: 'flex-start' }}>
                                    <Image source={require('@/assets/images/empty.png')}
                                        style={{
                                            width: 200,
                                            height: 200,
                                            alignSelf: 'center',
                                            resizeMode: 'contain',
                                            marginTop: spacing.lg
                                        }}
                                    />
                                    <Text style={{
                                        fontSize: fontSizes.lg,
                                        color: colors.gray400,
                                        textAlign: 'center',
                                    }}>
                                        Không tìm thấy kết quả cho &quot;{query}&quot;
                                    </Text>
                                </View>
                            )
                        )}
                    </View>
                    <NavBar />
                </View>

                <ResultModal
                    visible={isResultVisible}
                    onClose={() => {
                        setIsResultVisible(false);
                        setSelectedWordId(null);
                    }}
                    state={resultState}
                />

                <ErrorModal
                    visible={isErrorVisible}
                    onClose={() => setIsErrorVisible(false)}
                    message={errorMessage}
                />

                <CollectionModal
                    inDictionary={true}
                    isVisible={isCollectionVisible}
                    onCancel={handleCancelAddToCollection}
                    // collections={collections}
                    onConfirm={() => {
                        setIsCollectionVisible(false);
                        setResultState("save");
                        setIsResultVisible(true);
                    }}
                    onAdd={() => {
                        setIsCollectionVisible(false);
                        setIsAddModalVisible(true);
                    }}
                    signWordId={selectedWordId!}
                    onError={showError}
                />

                <AddCollectionModal
                    isVisible={isAddModalVisible}
                    onCancel={handleCancelAddToCollection}
                    onAdd={() => {
                        fetchWords();
                        setIsAddModalVisible(false);
                        setResultState("save");
                        setIsResultVisible(true);
                    }}
                    signWordId={selectedWordId!}
                    onError={showError}
                />

                <ConfirmActionModal
                    visible={confirmUnlikeVisible}
                    message={`Bạn có muốn bỏ thích từ ${selectedWord} này không?`}
                    onCancel={() => setConfirmUnlikeVisible(false)}
                    onConfirm={handleUnlikeWordFromCollection}
                />
                
                <UpgradeModal
                    visible={showUpgradeModal}
                    onClose={() => setShowUpgradeModal(false)}
                    currentWords={wordsForTopic.filter(w => w.isInUserCollection).length}
                    limit={limit}
                    onUpgrade={() => {
                        setShowUpgradeModal(false);
                        router.push('/planIntro'); 
                    }}
                />

            </SafeAreaView>
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2C6AEF",
    },

    searchContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: spacing.md,
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
        marginBottom: spacing.md
    },
    main: {
        //flex: 3,
        flex: 3,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        backgroundColor: colors.gray50,
        // gray50: #FDFDFE
        paddingTop: spacing.md,
        paddingHorizontal: spacing.md,
        gap: spacing.lg
    }, topicsContainer: {
        paddingHorizontal: spacing.md,
        flex: 1,
        gap: spacing.md,
        // backgroundColor: 'red'
    },
    topicContainer: {
        // backgroundColor: 'red',
        flexDirection: 'row',
        gap: spacing.lg,
    },
    topic: {
        flex: 0.5,
        borderRadius: spacing.md,
        // padding: spacing.md,
        paddingBottom: spacing.sm,
        // backgroundColor: '#E0F2FE'
        backgroundColor: 'white',
        borderColor: colors.gray300,
        borderWidth: 2,

    },
    topicImage: {
        width: '100%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    topicTitle: {
        textAlign: 'center',
        fontSize: fontSizes.md,
        fontWeight: 600,
        color: colors.primary600
    },
    categoryCard: {
        borderWidth: 1,
        flexShrink: 1,
        borderColor: colors.gray400,
        backgroundColor: colors.gray200,
        borderRadius: 5,
        alignSelf: 'flex-start',
        padding: spacing.sm
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
