// app/(dictionary)/[word].tsx
import HomeIcon from '@/assets/images/home.svg';
import Profile from '@/assets/images/profile.svg';
import Search from '@/assets/images/search.svg';
import AddCollectionModal from "@/components/AddModal";
import AnimatedLikeIcon from "@/components/animation/AnimatedLikeIcon";
import BackButton from "@/components/BackButton";
import CollectionModal from "@/components/CollectionModal";
import ResultModal from "@/components/ResultModal";
import { colors, fontSizes, spacing } from "@/global/theme";
import { Collection, WordByIdResponse, SignWord, RelatedWord } from "@/types/Types";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useWalkthroughStep, WalkthroughProvider } from "react-native-interactive-walkthrough";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { SafeAreaView } from 'react-native-safe-area-context';
// import Wave from '@/assets/images/wave.svg';
import Scan from '@/assets/images/scan.svg';
import { useNav } from "@/context/NavContext";
import WordDefinition6Overlay from "@/components/walkthrough/WordDefinitionOverlay6";
import Video from 'react-native-video';
import NavBar from '@/components/NavBar';
import { getRelatedWords, getWordById, removeWordFromCollections } from '@/services/api';

import { navigate } from 'expo-router/build/global-state/routing';
import { AuthContext } from '@/context/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TestRender from '@/components/animation/testRender';
import ConfirmActionModal from '@/components/ConfirmActionModal';
import ErrorModal from '@/components/ErrorModal';
const ICON_SIZE = 20;


export default function WordScreen() {
    const { activeTab, setActiveTab } = useNav();
    const { width, height } = Dimensions.get('window');

    const { word } = useLocalSearchParams<{ word: string; }>();
    const [confirmUnlikeVisible, setConfirmUnlikeVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isErrorVisible, setIsErrorVisible] = useState(false);

    const [relatedWords, setRelatedWords] = useState<RelatedWord[]>([]);

    const [isCollectionVisible, setIsCollectionVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [resultState, setResultState] = useState<"add" | "save" | "unsave">("save");
    const [signWord, setSignWord] = useState<SignWord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWord = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = await AsyncStorage.getItem("userToken");
                if (!token) throw new Error("Missing access token");

                const result: WordByIdResponse = await getWordById(token, word);
                if (result.isSuccess) {
                    if (result.data) {
                        setSignWord(result.data);
                        const related = await getRelatedWords(result.data.signWordId);
                        setRelatedWords(related);
                    }
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch word');
            } finally { setLoading(false); };
        };

        fetchWord();
    }, [word]);

    const handleToggleLike = () => {
        if (!signWord) return;

        if (signWord.isInUserCollection) {
            setConfirmUnlikeVisible(true);
            return;
        }

        setSignWord(prev => prev ? { ...prev, isInUserCollection: true } : prev);
        setIsCollectionVisible(true);
    };


    const handleCancelAddToCollection = () => {
        if (!signWord) return;

        // Revert optimistic update
        setSignWord(prev => prev ? { ...prev, isInUserCollection: false } : prev);

        setIsCollectionVisible(false);
    };
    const handleUnlikeWordFromCollection = async () => {
        if (!signWord) return;

        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                setErrorMessage("Bạn chưa đăng nhập");
                setIsErrorVisible(true);
                return;
            }

            await removeWordFromCollections(token, {
                collectionId: "",
                signWordId: signWord.signWordId,
            });

            // Update state
            setSignWord(prev => prev ? { ...prev, isInUserCollection: false } : prev);

            setResultState("unsave");
            setIsResultVisible(true);
        } catch (err) {
            console.log("Failed to remove word:", err);
            setErrorMessage("Có lỗi khi bỏ thích từ này");
            setIsErrorVisible(true);
        } finally {
            setConfirmUnlikeVisible(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, gap: spacing.md }}>
                <View style={{ paddingHorizontal: spacing.sm, marginTop: spacing.md }}>
                    <BackButton color={colors.gray300} onPress={() => navigate("/(dictionary)")} />
                    {/* <BackButton color={colors.gray300}
                        onPress={() => router.back()}
                    /> */}
                </View>

                <Animated.View
                    style={styles.definitionContainer}
                    entering={FadeInLeft.duration(500).springify()}

                >
                    {error ? (
                        <Text style={styles.word}>{error}</Text>
                    ) : signWord ? (
                        <View style={styles.wordSection}>
                            <View style={styles.wordHeader}>
                                <Text style={styles.word}>{signWord.word}</Text>
                                <Text style={styles.wordType}>({signWord.wordType})</Text>
                            </View>

                            <View style={styles.definitionBox}>
                                <Text style={styles.definition}>{signWord.definition}</Text>
                            </View>
                        </View>

                    ) : null}

                </Animated.View>
                <Animated.View
                    entering={FadeInLeft.delay(100).duration(500).springify()}
                    style={{
                        alignSelf: 'flex-start',
                        position: 'absolute',
                        top: 80,
                        right: 20
                    }}
                >
                    <AnimatedLikeIcon
                        primary={colors.red300}
                        accent={colors.gray200}
                        // onPress={() => {
                        //     setIsCollectionVisible(true);
                        // }}
                        onPress={() => handleToggleLike()}
                        sizeModifier={1.3}
                        isLiked={signWord?.isInUserCollection}
                    />
                </Animated.View>


                <View style={styles.main}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{
                            paddingBottom: spacing.lg * 4
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ paddingTop: spacing.md, flex: 1, gap: spacing.lg }}>
                            <Animated.View
                                style={styles.videoContainer}
                                entering={FadeInLeft.delay(200).duration(500).springify()}
                            >
                                {signWord?.category === 'Chữ cái' ?
                                    <TestRender word={signWord.word} />
                                    : <Video
                                        source={{ uri: signWord?.signWordUri }}
                                        style={{ width: width - spacing.md * 2, height: width * 0.5625 }}
                                        controls={true}
                                        paused={true}
                                    />
                                }
                                {/* <Video
                                    source={{ uri: signWord?.signWordUri }}
                                    style={{ width: width - spacing.md * 2, height: width * 0.5625 }}
                                    controls={true}
                                    paused={true}
                                /> */}

                                {/* <Image
                                    source={require('@/assets/images/3d.png')}
                                    style={{
                                        width: 200,
                                        height: 200,
                                        alignSelf: 'center',
                                        resizeMode: 'contain',
                                    }}
                                /> */}
                            </Animated.View>
                            {signWord?.category !== 'Chữ cái' && (
                                <View style={{ gap: spacing.sm }}>
                                    <Animated.View
                                        entering={FadeInLeft.delay(300).duration(500).springify()}
                                    >
                                        <Text style={{ fontSize: fontSizes.md * 1.4, fontWeight: 600, color: colors.primary500 }}>
                                            Ví dụ sử dụng:
                                        </Text>
                                    </Animated.View>
                                    <Animated.View
                                        entering={FadeInLeft.delay(400).duration(500).springify()}
                                    >
                                        <Text style={{ fontSize: fontSizes.sm * 1.2, fontStyle: 'italic', fontWeight: 500, color: colors.primary700 }}>
                                            &quot;{signWord?.exampleSentence}&quot;
                                        </Text>
                                    </Animated.View>
                                </View>
                            )}

                            <Animated.View
                                entering={FadeInLeft.delay(300).duration(500).springify()}
                                style={{ flex: 1, gap: spacing.sm }}>
                                <Text style={{ fontSize: fontSizes.md, fontWeight: 600, color: colors.primary500 }}>
                                    Các ký hiệu liên quan
                                </Text>
                                <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', }}>
                                    {relatedWords.map((item, index) => (
                                        // <View key={index} style={styles.relatedWords}>
                                        //     <Text>{item}</Text>
                                        // </View>
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.relatedWords}
                                            onPress={() => {
                                                router.push(`./${encodeURIComponent(item.relatedSignWordId)}`);
                                            }}
                                        >
                                            <Text style={{ fontSize: fontSizes.sm * 1.2, fontWeight: 600, color: colors.primary700 }}>
                                                {item.word}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </Animated.View>
                        </View>
                    </ScrollView>
                </View>

                <ResultModal
                    visible={isResultVisible}
                    onClose={() => setIsResultVisible(false)}
                    state={resultState}
                />

                <CollectionModal
                    isVisible={isCollectionVisible}
                    onCancel={handleCancelAddToCollection}
                    // onCancel={() => setIsCollectionVisible(false)}
                    onConfirm={() => {
                        setIsCollectionVisible(false);
                        setResultState("save");
                        setIsResultVisible(true);
                    }}
                    onAdd={() => {
                        setIsCollectionVisible(false);
                        setIsAddModalVisible(true);
                    }}
                />

                <AddCollectionModal
                    signWordId={signWord?.signWordId}
                    isVisible={isAddModalVisible}
                    onCancel={() => setIsAddModalVisible(false)}
                    onAdd={() => {
                        setIsAddModalVisible(false);
                        setResultState("add");
                        setIsResultVisible(true);
                    }}
                />

                <ConfirmActionModal
                    visible={confirmUnlikeVisible}
                    message={`Bạn có muốn bỏ thích từ "${signWord?.word}" không?`}
                    onCancel={() => setConfirmUnlikeVisible(false)}
                    onConfirm={handleUnlikeWordFromCollection}
                />

                <ErrorModal
                    visible={isErrorVisible}
                    onClose={() => setIsErrorVisible(false)}
                    message={errorMessage}
                />
                <NavBar />
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dictionaryBackground
    },
    definitionContainer: {
        flex: 1,
        paddingLeft: spacing.md,
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
        maxWidth: '85%',
    },
    main: {
        flex: 5.5,
        borderRadius: 30,
        backgroundColor: colors.gray50,
        paddingTop: spacing.md,
        paddingHorizontal: spacing.md,
        gap: spacing.lg
    },
    word: {
        fontSize: fontSizes["4xl"],
        fontWeight: 800,
        color: colors.gray50
    },
    definition: {
        fontSize: fontSizes.md,
        fontWeight: 700,
        color: colors.gray100
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white", // or your theme background
    },
    wordSection: {
        gap: spacing.sm,
        paddingRight: spacing.lg
    },

    wordHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: spacing.sm / 2,
        flexWrap: 'wrap'
    },
    wordType: {
        fontSize: fontSizes.md,
        fontStyle: 'italic',
        color: colors.gray200,
    },

    definitionBox: {

    },

    videoContainer: {
        // borderRadius: 5,
        // borderWidth: 1,
        // borderColor: 'yellow',
        // flex: 1.2,
        // backgroundColor: 'black'
    },
    relatedWords: {
        padding: spacing.sm,
        backgroundColor: colors.gray50,
        borderRadius: 10,
        borderWidth: .5,
        borderColor: colors.gray400,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,

        elevation: 2,
    },
    containerNav: {
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
    button: {

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