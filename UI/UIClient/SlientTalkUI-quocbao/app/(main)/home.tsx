import HomeIcon from '@/assets/images/home.svg';
import Profile from '@/assets/images/profile.svg';
import Search from '@/assets/images/search.svg';
import AnimateChveron from '@/components/animation/AnimateChveron';
import AnimatedTyping from '@/components/animation/AnimatedTyping';
import BackgroundDecoration from '@/components/BackgroundDecoration';
import Header from '@/components/Header';
import HomeScreenOverlay from '@/components/walkthrough/HomeScreenOverlay';
import WordOfTheDayOverlay from '@/components/walkthrough/HomeScreenOverlay2';
import WordOfTheDayButtonOverlay from '@/components/walkthrough/HomeScreenOverlay3';
import WelcomeMessageOverlay from '@/components/walkthrough/WelcomeMessageOverlay';
import { useNav } from '@/context/NavContext';
import { colors, fontSizes, spacing } from '@/global/theme';
import { Link, router } from 'expo-router';
import React, { use, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useWalkthroughStep } from 'react-native-interactive-walkthrough';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Wave from '@/assets/images/wave.svg';
import Video from 'react-native-video';

import Scan from '@/assets/images/scan.svg';
import { useWalkthrough } from '@/hooks/useWalkthrough';
import { getWordOfTheDay } from '@/services/api';
const ICON_SIZE = 20;

const Home = () => {
    const { activeTab, setActiveTab } = useNav();
    const renderCount = useRef(0);
    const [wordOfTheDay, setWordOfTheDay] = useState<any | null>(null);
    const [loadingWord, setLoadingWord] = useState(true);

    useEffect(() => {
        const fetchWord = async () => {
            try {
                const data = await getWordOfTheDay();
                if (data.isSuccess) {
                    setWordOfTheDay(data.data);
                }
            } catch (err) {
                console.error("Không lấy được từ của ngày hôm nay!", err);
            } finally {
                setLoadingWord(false);
            }
        };
        fetchWord();
    }, []);


    return (
        <SafeAreaView style={styles.container} >
            <BackgroundDecoration />
            {/* <View className='flex flex-1' style={styles.background}> */}
            <Header />
            <View className='flex-1'>
                <View style={styles.main}>

                    <View style={{ marginTop: spacing.md }}>
                        <AnimatedTyping
                            textToType={["Xin chào"]}
                            displayLogo={false}
                            textStyle={styles.greeting}
                        />
                    </View>

                    <Animated.View
                        style={styles.summary}
                        entering={FadeInLeft.delay(200).duration(1000).springify()}
                    >
                        <View style={{
                            flex: 1,
                            gap: 8,
                            paddingVertical: spacing.sm,
                            borderRightWidth: .5,
                            borderRightColor: colors.gray500,
                        }}>
                            <Text style={{
                                ...styles.summaryTitle, textAlign: 'center',
                            }}>Chuỗi</Text>
                            <View>
                                <View className='flex-row justify-center' >
                                    <Image source={require('@/assets/images/flame_1.png')}
                                        style={{
                                            resizeMode: 'contain',
                                        }}
                                        width={35}
                                        height={35}
                                    />
                                    <Text style={{ fontSize: fontSizes.xl, color: colors.gray700, fontWeight: 800, alignSelf: 'center' }}>4</Text>
                                </View>
                                <Text style={{ fontSize: fontSizes.md, color: colors.gray500, textAlign: 'center' }}>ngày</Text>
                            </View>
                        </View>
                        <View style={{ flex: 3, gap: 8, ...styles.summaryBulletContainer }}>
                            <View>
                                <Text style={{
                                    textAlign: 'center',
                                    paddingHorizontal: spacing.xs,
                                    paddingBottom: spacing.xs,
                                    color: colors.gray700,
                                    fontWeight: 500,
                                    fontSize: fontSizes.lg
                                }}>
                                    Tuần này bạn đã
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                {/* <View style={{ flex: 1 }}>
                                    <Text style={{
                                        color: colors.primary400,
                                        textAlign: 'center',
                                        fontSize: fontSizes.lg,
                                        fontWeight: 700
                                    }}>320</Text>
                                    <Text style={{
                                        flexShrink: 1,
                                        flexWrap: 'wrap',
                                        textAlign: 'center',
                                        fontSize: fontSizes.md,
                                        color: colors.gray500
                                    }}>phút luyện tập</Text>
                                </View> */}
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: 700, color: colors.orange400, textAlign: 'center', fontSize: fontSizes.lg }}>12</Text>
                                    <Text style={{
                                        flexShrink: 1,
                                        flexWrap: 'wrap',
                                        textAlign: 'center',
                                        fontSize: fontSizes.md,
                                        color: colors.gray500
                                    }}>từ tìm kiếm</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: 700, color: colors.green400, textAlign: 'center', fontSize: fontSizes.lg }}>1</Text>
                                    <Text style={{
                                        flexShrink: 1, flexWrap: 'wrap', textAlign: 'center',
                                        fontSize: fontSizes.md,
                                        color: colors.gray500
                                    }}>
                                        phiên dịch real-time
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    <View
                        className='gap-4 mt-1'
                    //onLayout={onLayout}
                    >
                        {/* <Animated.View
                            entering={FadeInLeft.delay(300).duration(500).springify()}
                        >
                            <Text
                                style={{
                                    fontSize: fontSizes.xl,
                                    fontWeight: 600,
                                    color: colors.primary600
                                    //color: colors.gray50
                                }}>
                                Từ của ngày hôm nay
                            </Text>
                        </Animated.View>
                        <Animated.View
                            entering={FadeInLeft.delay(400).duration(500).springify()}
                            style={{
                                borderWidth: .75,
                                borderColor: colors.gray500,
                                borderRadius: 10,
                                backgroundColor: colors.gray100,
                                padding: spacing.md,
                                alignSelf: 'stretch',
                                gap: 8,
                                ...Platform.select({
                                    ios: {
                                        shadowColor: '#ddd',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4
                                    },
                                    android: { elevation: 2 },
                                }),
                            }}>
                            <View>
                                <View className='gap-4'>
                                    <View className='flex-row'>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: fontSizes['2xl'], fontWeight: 600, color: colors.gray800 }}>Bạn bè</Text>
                                        </View>
                        
                                        <View
                                        >
                                            <AnimateChveron
                                                onPress={() => {
                                                    router.push({
                                                        pathname: "/(dictionary)/word/[word]",
                                                        params: { word: "friend" },
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>

                                </View>
                            </View>
                            <View>
                                <Image
                                    source={require('@/assets/images/3d.png')}
                                    style={{
                                        width: 230,
                                        height: 230,
                                        alignSelf: 'center',
                                        resizeMode: 'contain',
                                        marginTop: spacing.lg
                                    }}
                                />

                            </View>

                        </Animated.View> */}
                        <Animated.View
                            entering={FadeInLeft.delay(400).duration(500).springify()}
                            style={{
                                borderWidth: .75,
                                borderColor: colors.gray500,
                                borderRadius: 10,
                                backgroundColor: colors.gray100,
                                padding: spacing.md,
                                alignSelf: 'stretch',
                                gap: 8,
                                ...Platform.select({
                                    ios: {
                                        shadowColor: '#ddd',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4
                                    },
                                    android: { elevation: 2 },
                                }),
                            }}>
                            {loadingWord ? (
                                <View style={{ alignItems: "center", paddingVertical: spacing.lg }}>
                                    <ActivityIndicator size="large" color={colors.primary500} />
                                </View>
                            ) : wordOfTheDay ? (
                                <View>
                                    <View className="gap-4">
                                        <View className="flex-row">
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: fontSizes['2xl'], fontWeight: 600, color: colors.gray800 }}>
                                                    {wordOfTheDay.word}
                                                </Text>
                                                <Text style={{ fontSize: fontSizes.xs, color: colors.blueAccent550, fontWeight: 400 }}>
                                                    {wordOfTheDay.category}
                                                </Text>
                                            </View>
                                            <View>
                                                <AnimateChveron
                                                    onPress={() => {
                                                        router.push({
                                                            pathname: "/(dictionary)/word/[word]",
                                                            params: { word: wordOfTheDay.signWordId },
                                                        });
                                                    }}
                                                />
                                            </View>
                                        </View>

                                        <Text style={{
                                            fontSize: fontSizes.sm,
                                            flexShrink: 1,
                                            flexWrap: 'wrap',
                                            color: colors.gray700
                                        }}>
                                            {wordOfTheDay.definition}
                                        </Text>
                                    </View>

                                    <View style={{ marginTop: spacing.md }}>
                                        {wordOfTheDay.category === "Chữ cái" ? (
                                            // Render mô hình 3D (dùng component TestRender hoặc Three.js)
                                            <Image
                                                source={require('@/assets/images/3d.png')}
                                                style={{
                                                    width: 200,
                                                    height: 200,
                                                    alignSelf: 'center',
                                                    resizeMode: 'contain',
                                                }}
                                            />
                                        ) : wordOfTheDay.signWordUri ? (
                                            <Video
                                                source={{ uri: wordOfTheDay.signWordUri }}
                                                style={{
                                                    width: '100%',
                                                    height: 230,
                                                    alignSelf: 'center',
                                                }}
                                                controls={true}
                                                paused={true}
                                            />
                                        ) : (
                                            <Text style={{ textAlign: "center", color: colors.gray500 }}>
                                                Không có media
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            ) : (
                                <Text>Không có từ hôm nay</Text>
                            )}
                        </Animated.View>
                    </View>

                </View>
                {/* <NavBar /> */}
                <View style={{ ...styles.containerNav }}>
                    <Link href="/(main)/home" asChild>
                        <TouchableOpacity style={styles.button} onPress={() => setActiveTab("home")}>
                            {/* <View style={{ backgroundColor: activeTab === "home" ? "red" : "transparent", ...styles.wrapper }}> */}
                            <View style={styles.wrapper}>
                                <HomeIcon
                                    width={ICON_SIZE}
                                    height={ICON_SIZE}
                                    stroke={activeTab === "home" ? colors.primary400 : colors.gray500}
                                    fill={activeTab === "home" ? colors.primary400 : colors.gray500}
                                />
                                <Text style={{ color: activeTab === "home" ? colors.primary400 : colors.gray500, ...styles.text }}>Trang chủ</Text>
                            </View>
                        </TouchableOpacity>
                    </Link>

                    <Link href="/(translate)" asChild>
                        <TouchableOpacity style={styles.translateBtn} onPress={() => setActiveTab("translate")}>
                            <View style={{ ...styles.wrapper, }}>
                                <Scan
                                    width={ICON_SIZE}
                                    height={ICON_SIZE}
                                    stroke={activeTab === "translate" ? colors.primary400 : colors.gray500}
                                />
                                <Text style={{ color: activeTab === "translate" ? colors.primary400 : colors.gray500, ...styles.text }}>
                                    Phiên dịch
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Link>

                    <Link href="/(dictionary)" asChild>
                        <TouchableOpacity style={styles.button} onPress={() => setActiveTab("dictionary")}>
                            <View style={{ ...styles.wrapper, }}>
                                <Search
                                    width={ICON_SIZE}
                                    height={ICON_SIZE}
                                    stroke={activeTab === "dictionary" ? colors.primary400 : colors.gray500}
                                />
                                <Text style={{ color: activeTab === "dictionary" ? colors.primary400 : colors.gray500, ...styles.text }}>Từ điển</Text>
                            </View>
                        </TouchableOpacity>
                    </Link>

                    <Link href="/(profile)" asChild>
                        <TouchableOpacity style={styles.button} onPress={() => setActiveTab("profile")}>
                            <View style={{ ...styles.wrapper }}>
                                <Profile
                                    width={ICON_SIZE}
                                    height={ICON_SIZE}
                                    stroke={activeTab === "profile" ? colors.primary400 : colors.gray500}
                                />
                                <Text style={{ color: activeTab === "profile" ? colors.primary400 : colors.gray500, ...styles.text }}>Tài khoản</Text>
                            </View>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F7FA'
        // backgroundColor: colors.gray100
        // backgroundColor: '#2C6AEF'
    },
    test: {
        backgroundColor: 'red'
    },
    main: {
        display: 'flex',
        flex: 1,
        paddingTop: spacing.md,
        paddingHorizontal: spacing.md,

        gap: spacing.lg
    },
    greeting: {
        fontWeight: 600,
        fontSize: fontSizes['3xl'] * 1.5,
        color: colors.primary500,
        //color: colors.gray50,
        flex: 1
    },
    summary: {
        backgroundColor: colors.gray100,
        flexDirection: 'row',
        alignSelf: 'stretch',
        borderColor: colors.gray600,
        borderWidth: .75,
        borderRadius: 10,

        ...Platform.select({
            ios: {
                shadowColor: '#ddd',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4
            },
            android: { elevation: 2 },
        }),
    },
    summaryTitle: {
        fontSize: fontSizes.lg,
        fontWeight: 600,
        color: colors.gray700
    },
    summaryBulletContainer: {
        // backgroundColor: colors.orange300,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm
    },

    // card: {
    //     borderRadius: 12,
    //     // elevation: 10,
    //     padding: spacing.md,
    //     backgroundColor: colors.primary300,
    //     overflow: 'hidden',
    //     ...Platform.select({
    //         android: {
    //             elevation: 10
    //         }
    //     })
    // },
    // cardContent: {
    //     paddingHorizontal: spacing.sm,
    //     paddingVertical: spacing.sm
    // },
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
});;