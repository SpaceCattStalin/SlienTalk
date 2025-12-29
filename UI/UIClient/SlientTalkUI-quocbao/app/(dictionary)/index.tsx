import NavBar from '@/components/NavBar';
import Search from '@/components/Searchbar';
import { colors, fontSizes, spacing } from '@/global/theme';
import { ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddCollectionModal from '@/components/AddModal';
import AnimatedLikeIcon from '@/components/animation/AnimatedLikeIcon';
import CollectionModal from '@/components/CollectionModal';
import ResultModal from '@/components/ResultModal';
import { Collection, SignWord, SignWordCategoryResponse } from '@/types/Types';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInLeft, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import TwoLine from '@/assets/images/two_lines.svg';
import DictionarySearchOverlay from '@/components/walkthrough/DictionaryScreenOverlay';
import DictionarySaveOverlay from '@/components/walkthrough/DictionaryScreenOverlay3';
import { useWalkthroughStep } from 'react-native-interactive-walkthrough';
import DictionaryCategoryOverlay from '../../components/walkthrough/DictionaryScreenOverlay2';
import { useWalkthrough } from '@/hooks/useWalkthrough';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import { getWordsByCategory } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmActionModal from '@/components/ConfirmActionModal';
import { getUserLimit } from '@/services/userLimit';
import UpgradeModal from '@/components/UpgradeModal';

const Index = () => {
    const router = useRouter();

    const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

    const [query, setQuery] = useState("");
    const [allWords, setAllWords] = useState<SignWord[]>([]);
    const [results, setResults] = useState<SignWord[]>([]);
    const [loading, setLoading] = useState(false);

    const [isCollectionVisible, setIsCollectionVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [resultState, setResultState] = useState<"add" | "save">("save");
    const scale = useSharedValue(1);
    const [shouldRefetch, setShouldRefetch] = useState(false);
    const [confirmUnlikeVisible, setConfirmUnlikeVisible] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const [limit, setLimit] = useState(10);

    // useEffect(() => {
    //     const fetchWords = async () => {
    //         setLoading(true);
    //         try {
    //             const token = await AsyncStorage.getItem("userToken");
    //             if (!token) throw new Error("Missing access token");

    //             const result: SignWordCategoryResponse = await getWordsByCategory(token, "");
    //             if (result.isSuccess) {
    //                 setAllWords(result.data);   // store original data
    //                 setResults(result.data);
    //             } else {
    //                 setAllWords([]);
    //                 setResults([]);
    //             }
    //         } catch (error) {
    //             console.log("Failed to fetch words for topic:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchWords();
    // }, []);

    useEffect(() => {
        const init = async () => {
            const userLimit = await getUserLimit();
            setLimit(userLimit);

            try {
                const token = await AsyncStorage.getItem("userToken");
                if (!token) throw new Error("Missing access token");

                const result: SignWordCategoryResponse = await getWordsByCategory(token, "");
                if (result.isSuccess) {
                    setAllWords(result.data);
                    setResults(result.data);
                } else {
                    setAllWords([]);
                    setResults([]);
                }
            } catch (error) {
                console.log("Failed to fetch words for topic:", error);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        init();
    }, []);

    useEffect(() => {
        if (query.length > 0) {
            const filtered = allWords.filter((w) =>
                w.word.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        } else {
            setResults(allWords);  // reset to original list
        }
    }, [query, allWords]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handleToggleLike = (word: SignWord) => {
        setSelectedWordId(word.signWordId);

        if (!word.isInUserCollection) {
            setIsCollectionVisible(true);

            const savedWords = allWords.filter(w => w.isInUserCollection).length;
            if (savedWords >= limit) {
                setShowUpgradeModal(true);
                //return;
            }

            if (savedWords >= limit - 2) {
                setShowUpgradeModal(true);
                //return;
            }

            if (savedWords === 5) {
                setShowUpgradeModal(true);
                //return;
            }

            if (savedWords === 3) {
                setShowUpgradeModal(true);
                //return;
            }


            if (savedWords === 1) {
                setShowUpgradeModal(true);
                //return;
            }

            setIsCollectionVisible(true);

            setResults(prev => prev.map(item =>
                item.signWordId === word.signWordId
                    ? { ...item, isInUserCollection: true }
                    : item
            ));
            setAllWords(prev => prev.map(item =>
                item.signWordId === word.signWordId
                    ? { ...item, isInUserCollection: true }
                    : item
            ));
        } else {
            // Đã lưu → mở modal confirm bỏ thích
            setConfirmUnlikeVisible(true);
        }
    };

    const handleCancelAddToCollection = () => {
        if (!selectedWordId) return;

        // Revert optimistic update
        setResults(prev => prev.map(item =>
            item.signWordId === selectedWordId
                ? { ...item, isInUserCollection: false }
                : item
        ));

        setAllWords(prev => prev.map(item =>
            item.signWordId === selectedWordId
                ? { ...item, isInUserCollection: false }
                : item
        ));

        setIsCollectionVisible(false);
        setSelectedWordId(null);
    };

    const handleConfirmUnlike = async () => {
        if (!selectedWordId) return;

        // Optimistic update: bỏ lưu
        setResults(prev => prev.map(item =>
            item.signWordId === selectedWordId
                ? { ...item, isInUserCollection: false }
                : item
        ));
        setAllWords(prev => prev.map(item =>
            item.signWordId === selectedWordId
                ? { ...item, isInUserCollection: false }
                : item
        ));

        // TODO: Gọi API bỏ lưu khi có backend
        // await removeWordFromCollection(selectedWordId)

        setConfirmUnlikeVisible(false);
        setSelectedWordId(null);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
            <SafeAreaView style={styles.container}>
                {/* <Header /> */}
                <View style={{ flex: 1 }}>
                    <Animated.View
                        style={styles.searchContainer}
                        entering={FadeInLeft.duration(500).springify()}
                    >
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <Text
                                style={{
                                    paddingHorizontal: spacing.md,
                                    fontSize: fontSizes['2xl'],
                                    fontWeight: 700,
                                    color: colors.gray50
                                }}>
                                Bạn cần kiếm ký hiệu gì?
                            </Text>

                            <Pressable
                                onPressIn={() => { scale.value = withSpring(0.95); }}
                                onPressOut={() => { scale.value = withSpring(1); }}
                                onPress={() => router.push('./collections')}
                            >
                                <Animated.View style={[
                                    styles.buttonStyle,
                                    animatedStyle]}
                                >
                                    <TwoLine height={20} width={20} preserveAspectRatio="xMidYMid meet" />
                                </Animated.View>
                            </Pressable>
                        </View>
                        <Animated.View
                            //onLayout={step11OnLayout}
                            entering={FadeInLeft.delay(200).duration(500).springify()}
                        >
                            <Search value={query} onChange={setQuery} />
                        </Animated.View>
                    </Animated.View>

                    <View style={styles.main}>
                        {query ? (
                            results.length > 0 ? (
                                <View
                                    style={{
                                        marginTop: spacing.lg,
                                        paddingHorizontal: spacing.md
                                    }}
                                >
                                    <FlatList
                                        style={{ marginTop: 10, paddingBottom: 50 }}
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
                                                    }}
                                                >
                                                    <Text style={{
                                                        fontSize: fontSizes.lg,
                                                        color: colors.primary600,
                                                        fontWeight: 500
                                                    }}>
                                                        {item.word}
                                                    </Text>
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        gap: spacing.xs,
                                                        alignItems: 'center'
                                                    }}>
                                                        <AnimatedLikeIcon
                                                            accent='transparent'
                                                            primary={colors.primary600}
                                                            isLiked={item.isInUserCollection}
                                                            // onPress={() => {
                                                            //     setSelectedWordId(item.signWordId);
                                                            //     setIsCollectionVisible(true);
                                                            // }}
                                                            onPress={() => handleToggleLike(item)}
                                                        />
                                                        <ChevronRight
                                                            color={colors.primary700}
                                                            size={28}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            </Animated.View>
                                        )}
                                    />
                                </View>
                            ) : <View style={{ flex: 1, gap: spacing.md }}>
                                <Image source={require('@/assets/images/empty.png')}
                                    style={{
                                        width: 200,
                                        height: 200,
                                        alignSelf: 'center',
                                        resizeMode: 'contain',
                                        marginTop: spacing.lg
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: fontSizes.lg,
                                        color: colors.gray400,
                                        textAlign: 'center',
                                    }}>
                                    Không tìm thấy kết quả cho &quot;{query}&quot;
                                </Text>
                            </View>
                        ) : (
                            <View
                                style={{ flex: 1, gap: spacing.md, justifyContent: 'flex-start' }}
                            >
                                <Animated.View
                                    entering={FadeInDown.delay(300).duration(500).springify()}
                                >
                                    <Text style={{
                                        textAlign: 'center',
                                        color: colors.primary700,
                                        fontSize: fontSizes['2xl'],
                                        fontWeight: 700,
                                        marginTop: spacing.lg,
                                    }}>
                                        Khám phá theo chủ đề
                                    </Text>
                                </Animated.View>

                                <View style={styles.topicsContainer}>
                                    <Animated.View
                                        style={styles.topicContainer}
                                        entering={FadeInDown.delay(400).duration(500).springify()}
                                    //onLayout={step12OnLayout}
                                    >
                                        <TouchableOpacity
                                            style={styles.topic}
                                            onPress={() => {
                                                router.push(`./${encodeURIComponent("Chữ cái")}`);
                                            }}
                                        >
                                            <View style={styles.topicImage}>
                                                <Image
                                                    source={require('@/assets/images/char.png')}
                                                    style={styles.image}
                                                    resizeMode='contain'
                                                />
                                            </View>
                                            <Text style={styles.topicTitle}>Chữ cái</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.topic}
                                            onPress={() => {
                                                // router.push('./family');
                                                router.push(`./${encodeURIComponent("Gia đình")}`);
                                            }}
                                        >
                                            <View style={styles.topicImage}>
                                                <Image
                                                    source={require('@/assets/images/family.png')}
                                                    style={styles.image}
                                                    resizeMode='contain'
                                                />
                                            </View>
                                            <Text style={styles.topicTitle}>Gia đình</Text>
                                        </TouchableOpacity>

                                    </Animated.View>

                                    <Animated.View
                                        style={styles.topicContainer}
                                        entering={FadeInDown.delay(500).duration(500).springify()}
                                    >
                                        <TouchableOpacity
                                            style={styles.topic}
                                            onPress={() => {
                                                router.push(`./${encodeURIComponent("Trường học")}`);
                                            }}
                                        >
                                            <View style={styles.topicImage}>
                                                <Image
                                                    source={require('@/assets/images/school.png')}
                                                    style={styles.image}
                                                    resizeMode='contain'
                                                />
                                            </View>
                                            <Text style={styles.topicTitle}>Trường học</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.topic}
                                            onPress={() => {
                                                router.push(`./${encodeURIComponent("Câu hỏi")}`);
                                            }}
                                        >
                                            <View style={styles.topicImage}>
                                                <Image
                                                    source={require('@/assets/images/question.png')}
                                                    style={styles.image}
                                                    resizeMode='contain'
                                                />
                                            </View>
                                            <Text style={styles.topicTitle}>Câu hỏi</Text>
                                        </TouchableOpacity>
                                        {/* <View
                                            style={{ ...styles.topic, opacity: 0 }}
                                        // onPress={() => {
                                        //     router.push(`./${encodeURIComponent("Trường học")}`);
                                        // }}
                                        >
                                            <View style={styles.topicImage}>
                                                <Image
                                                    source={require('@/assets/images/school.png')}
                                                    style={styles.image}
                                                    resizeMode='contain'
                                                />
                                            </View>
                                            <Text style={styles.topicTitle}>Trường học</Text>
                                        </View> */}
                                    </Animated.View>
                                </View>
                            </View>)}
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

                <CollectionModal
                    inDictionary={true}
                    isVisible={isCollectionVisible}
                    onCancel={handleCancelAddToCollection}
                    onConfirm={() => {
                        setIsCollectionVisible(false);
                        setResultState("save");
                        setIsResultVisible(true);
                        setShouldRefetch((prev) => !prev);
                    }}
                    refetch={shouldRefetch}
                    onAdd={() => {
                        setIsCollectionVisible(false);
                        setIsAddModalVisible(true);
                    }}
                    signWordId={selectedWordId!}
                />

                <AddCollectionModal
                    isVisible={isAddModalVisible}
                    onCancel={() => {
                        setIsAddModalVisible(false);
                        setSelectedWordId(null);
                    }}
                    onAdd={() => {
                        setIsAddModalVisible(false);
                        setResultState("add");
                        setIsResultVisible(true);
                    }}
                    signWordId={selectedWordId!}
                />

                <ConfirmActionModal
                    visible={confirmUnlikeVisible}
                    message={`Bạn có chắc muốn bỏ lưu từ "${allWords.find(w => w.signWordId === selectedWordId)?.word}" không?`}
                    onCancel={() => setConfirmUnlikeVisible(false)}
                    onConfirm={handleConfirmUnlike}
                    cancelText="Hủy"
                    confirmText="Bỏ thích"
                />

                <UpgradeModal
                    visible={showUpgradeModal}
                    onClose={() => setShowUpgradeModal(false)}
                    currentWords={allWords.filter(w => w.isInUserCollection).length - 1}
                    limit={limit}
                    onUpgrade={() => {
                        setShowUpgradeModal(false);
                        router.push('/planIntro');
                    }}
                />

            </SafeAreaView>
        </KeyboardAvoidingView >
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2C6AEF"
    },
    searchContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: spacing.md,
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
        marginBottom: spacing.md
    },
    buttonStyle: {
        alignItems: 'center',
        padding: spacing.sm * 1.2,
        borderRadius: 5,
        backgroundColor: '#4B7FF2',
        alignSelf: 'center',
        marginRight: spacing.sm,
    },
    main: {
        //flex: 3,
        flex: 4,
        borderRadius: 60,
        backgroundColor: colors.gray50,
        // gray50: #FDFDFE
        paddingTop: spacing.md,
        paddingHorizontal: spacing.md,
        gap: spacing.lg
    },
    topicsContainer: {
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