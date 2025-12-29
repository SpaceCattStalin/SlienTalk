import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSizes, spacing } from '@/global/theme';
import BackButton from '@/components/BackButton';
import { router, useLocalSearchParams } from 'expo-router';
import NavBar from '@/components/NavBar';

import Girl from '@/assets/images/girl.svg';
import Boy from '@/assets/images/boy.svg';
import VTBackground from '@/assets/images/vt_bg.svg';
import AnimatedArrowButton from '@/components/animation/AnimatedArrowButton';
import AnimatedText from '@/components/animation/AnimatedText';
import Animated, { FadeInLeft, FadeInRight, } from 'react-native-reanimated';


const Mode = () => {
    const { name } = useLocalSearchParams<{ name?: string; }>();
    const [selectedMode, setSelectedMode] = useState<"recognition" | "practice" | null>(null);


    return (
        <SafeAreaView style={styles.container}>
            <VTBackground
                width="100%"
                height="100%"
                style={{ position: 'absolute', opacity: 0.4 }}
                preserveAspectRatio="xMidYMid slice"
            />

            <View style={styles.header}>
                <BackButton color={colors.primary600} />

                <View style={{ gap: spacing.sm, marginBottom: spacing.md * 1.5 }}>
                    <Animated.View
                        entering={FadeInLeft.duration(500).springify()}
                    >
                        <Text style={styles.word}>Luyện tập</Text>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInLeft.delay(200).duration(500).springify()}
                    >
                        <Text style={{
                            fontSize: fontSizes.xl,
                            fontWeight: 400,
                            color: colors.primary500
                        }}>
                            Bộ sưu tập: <Text style={{
                                fontSize: fontSizes['2xl'],
                                fontWeight: 600,
                                color: colors.primary600
                            }}>
                                &quot;{name}&quot;
                            </Text>
                        </Text>
                    </Animated.View>
                </View>
            </View>
            <Animated.View style={{
                flex: 1,
                paddingBottom: 420,
            }}
                entering={FadeInRight.delay(400).duration(500).springify()}
            >
                <Pressable
                    style={[
                        styles.modeCard,
                        selectedMode === "recognition" && styles.selectedCard
                    ]}
                    onPress={() =>
                        setSelectedMode(prev =>
                            prev === "recognition" ? null : "recognition"
                        )
                    }
                >
                    {/* <View style={{ flex: 2, backgroundColor: 'red' }}> */}
                    <View style={{ flex: 2, justifyContent: "flex-end" }}>
                        <Girl />
                    </View>

                    <View style={{ flex: 3, paddingLeft: spacing.md, paddingRight: spacing.sm, paddingVertical: spacing.md }}>
                        {/* <View style={{ flex: 2, backgroundColor: 'blue', paddingRight: spacing.sm, paddingVertical: spacing.md }}> */}
                        <Text style={{
                            color: colors.gray50,
                            fontWeight: 600,
                            fontSize: fontSizes.xl,
                            marginBottom: spacing.sm
                        }}>
                            Nhận diện ký hiệu
                        </Text>

                        <Text style={{
                            color: colors.gray200,
                            fontWeight: 500,
                            fontSize: fontSizes.xs,
                            fontStyle: 'italic',
                            marginBottom: spacing.md
                        }}>
                            Cùng mình ôn từ vựng mỗi ngày nhé!
                        </Text>

                        <Text style={{
                            color: colors.gray200,
                            fontWeight: 300,
                            fontSize: fontSizes.sm,
                            marginBottom: spacing.md
                        }}>
                            Nhận diện ký hiệu là
                            chế độ học tập Muitiple Choice
                            với mô hình 3D thân thiện.
                        </Text>

                        {selectedMode === "recognition" && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: spacing.sm,
                                // opacity: selectedMode === "recognition" ? 1 : 0,
                                // height: selectedMode === "recognition" ? "auto" : 0,
                            }}>
                                {/* <AnimatedText> */}
                                <Text style={{
                                    color: colors.gray200,
                                    fontWeight: 600,
                                    fontSize: fontSizes.lg
                                }}>
                                    Bắt đầu thôi nào!
                                </Text>
                                {/* </AnimatedText> */}
                                <AnimatedArrowButton onPress={() => {
                                    setSelectedMode(null);
                                    router.push("./question");
                                }} />
                            </View>
                        )}
                    </View>
                </Pressable>

                <View style={{
                    alignSelf: 'stretch',
                    // backgroundColor: 'red',
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.primary300,
                    paddingVertical: spacing.lg
                }}>
                    <View style={{
                        paddingVertical: spacing.sm,
                        alignSelf: 'stretch',
                        backgroundColor: colors.gray200
                    }}>
                        <Text style={{
                            fontSize: fontSizes.md * 1.3,
                            color: colors.primary600,
                            textAlign: 'center',
                            fontWeight: 700,
                        }}>
                            Bạn muốn học như thế nào?
                        </Text>
                    </View>
                </View>

                <Pressable
                    style={[
                        { marginTop: spacing.md },
                        styles.modeCard,
                        selectedMode === "practice" && styles.selectedCard
                    ]}
                    onPress={() =>
                        setSelectedMode(prev =>
                            prev === "practice" ? null : "practice"
                        )}
                >
                    <View style={{ flex: 3, paddingLeft: spacing.sm, paddingVertical: spacing.md }}>
                        {/* <View style={{ flex: 2, backgroundColor: 'blue', paddingRight: spacing.sm, paddingVertical: spacing.md }}> */}
                        <Text style={{
                            color: colors.gray50,
                            fontWeight: 600,
                            fontSize: fontSizes.xl,
                            marginBottom: spacing.sm
                        }}>
                            Thực hành ký hiệu trước camera
                        </Text>

                        <Text style={{
                            color: colors.gray200,
                            fontWeight: 500,
                            fontSize: fontSizes.xs,
                            fontStyle: 'italic',
                            marginBottom: spacing.md
                        }}>
                            Bạn muốn thử thách bản thân không?
                        </Text>

                        <Text style={{
                            color: colors.gray200,
                            fontWeight: 300,
                            fontSize: fontSizes.sm,
                            marginBottom: spacing.sm
                        }}>
                            Thực hành ký hiệu trước camera
                            là chế độ học tập nhận diện
                            trực tiếp thời gian thực.
                        </Text>
                        {selectedMode === "practice" && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: spacing.sm,
                                alignSelf: 'stretch'
                            }}>
                                {/* <Text style={{ color: colors.gray200, fontWeight: 600, fontSize: fontSizes.lg }}>Bắt đầu thôi nào!</Text> */}
                                {/* <AnimatedText> */}
                                <Text style={{
                                    color: colors.gray200,
                                    fontWeight: 600,
                                    fontSize: fontSizes.lg
                                }}>
                                    Bắt đầu thôi nào!
                                </Text>
                                {/* </AnimatedText> */}
                                <AnimatedArrowButton onPress={() => {
                                    setSelectedMode(null);
                                    router.push("./question");
                                }} />
                            </View>
                        )}
                    </View>

                    <View style={{ flex: 2, justifyContent: "flex-end" }}>
                        <Boy />
                    </View>
                </Pressable>
            </Animated.View>
            <NavBar />
        </SafeAreaView >
    );
};

export default Mode;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary50
    },
    header: {
        paddingTop: spacing.sm,
        paddingHorizontal: spacing.md,
        gap: spacing.sm
    },
    word: {
        fontSize: fontSizes["4xl"],
        fontWeight: 800,
        color: colors.primary600
    },
    // collectionCard: {
    //     backgroundColor: colors.gray50,
    //     marginVertical: spacing.sm,
    //     padding: spacing.sm * 1.3,

    //     borderRadius: 10,
    //     borderWidth: .2,
    //     borderColor: colors.gray400,

    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 4,

    //     elevation: 2,
    // },
    button: {
        borderWidth: .2,
        borderColor: colors.gray400,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,

        elevation: 4,
    },
    modeCard: {
        flexDirection: "row",
        // backgroundColor: colors.primary500,
        backgroundColor: "rgba(44, 106, 239, 0.8)",
        marginHorizontal: spacing.lg,
        alignSelf: "stretch",
        overflow: "hidden",
        marginBottom: spacing.md,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "transparent",
        // height: 250
    },
    selectedCard: {
        borderColor: colors.primary400,
        backgroundColor: colors.primary500,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 6,
    },
    modeTitle: {
        color: colors.gray50,
        fontWeight: "600",
        fontSize: fontSizes.xl,
        marginBottom: spacing.sm,
    },
    modeSubtitle: {
        color: colors.gray200,
        fontWeight: "500",
        fontSize: fontSizes.xs,
        fontStyle: "italic",
        marginBottom: spacing.lg,
    },
    modeDescription: {
        color: colors.gray200,
        fontWeight: "300",
        fontSize: fontSizes.sm,
        marginBottom: spacing.sm,
    },
});