import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, fontSizes, spacing } from '@/global/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ArrowRight, Key, Option } from 'lucide-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

import ResetQuestion from '@/assets/images/reset-question.svg';
import { useSharedValue } from 'react-native-reanimated';
import AnimatedText from '@/components/animation/AnimatedText';
import BottomSheet from '@/components/BottomSheet';
import FeedbackPanel from '@/components/FeedbackPanel';
import { router } from 'expo-router';
import Result from './result';
import { LinearGradient } from 'expo-linear-gradient';

type Option = {
    key: string;
    text: string;
};

type Question = {
    question: string;
    options: Option[];
    correct: string;
};
const questions: Question[] = [
    {
        question: "Ký hiệu này là gì?",
        options: [
            { key: "A", text: "Bố" },
            { key: "B", text: "Con" },
            { key: "C", text: "Cô giáo" },
            { key: "D", text: "Nhà" },
        ],
        correct: "A",
    },
    {
        question: "Ký hiệu này là gì?",
        options: [
            { key: "A", text: "Mẹ" },
            { key: "B", text: "Bạn" },
            { key: "C", text: "Ông" },
            { key: "D", text: "Bà" },
        ],
        correct: "A",
    },
    {
        question: "Ký hiệu này là gì?",
        options: [
            { key: "A", text: "Cha" },
            { key: "B", text: "Cô giáo" },
            { key: "C", text: "Anh" },
            { key: "D", text: "Em" },
        ],
        correct: "B",
    },
];


const Question = () => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [prevSelectedOption, setPrevSelectedOption] = useState<Option | null>(null);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showFeedBack, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);

    const progress = useSharedValue(1);

    useEffect(() => {
        progress.value = questionIndex + 1;
    }, [questionIndex, progress]);

    let currentQuestion = questions[questionIndex];

    const handleSubmitAnswer = () => {
        const correct = selectedOption?.key === currentQuestion.correct;
        // setPrevSelectedOption(selectedOption);
        setSelectedOption(null);
        setIsCorrect(correct);

        if (correct) {
            setScore((prev) => prev + 1);
        }

        setShowFeedback(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* <LinearGradient
                colors={['#0B3478', '#2877ED']}
                locations={[0, 0.5]}
                start={{ x: 1, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFillObject}
            /> */}
            <View style={styles.main}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => router.back()}
                    >
                        <Feather name="x" size={24} color={colors.primary600} />
                    </TouchableOpacity>
                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBarBackground}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    { width: `${((questionIndex + 1) / questions.length) * 100}%` },
                                ]}
                            />
                        </View>
                        {/* <AnimatedText progress={progress} max={questions.length} /> */}
                    </View>

                </View>
                <Text style={styles.question}>{currentQuestion.question}</Text>

                <View style={styles.videoContainer}>
                    <View style={styles.videoView}>
                        <Image
                            source={require('@/assets/images/3d.png')}
                            style={{
                                width: "100%",
                                height: "100%",
                                alignSelf: 'center',
                                resizeMode: 'contain',
                                marginTop: spacing.lg
                            }}
                        />
                    </View>
                    <View style={styles.videoActionBtnContainer}>
                        <FontAwesome name="refresh" size={24} color={colors.primary700} />
                        <Feather name="flag" size={24} color={colors.primary700} />
                    </View>
                </View>
                <View style={styles.questionView}>
                    {currentQuestion.options.map((option, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                disabled={showFeedBack}
                                style={[
                                    styles.option,
                                    prevSelectedOption?.key === option.key && styles.optionBtnSelected,
                                ]}
                                onPress={() => {
                                    if (selectedOption?.key === option.key) {
                                        setPrevSelectedOption(null);
                                        setSelectedOption(null);
                                    } else {
                                        setPrevSelectedOption(option);
                                        setSelectedOption(option);
                                    }
                                }}
                            >
                                <Text style={[
                                    styles.optionText,
                                    prevSelectedOption?.key === option.key && styles.optionTextSelected,
                                ]}>{option.text}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

            </View>
            <BottomSheet isVisible={selectedOption != null}>
                <TouchableOpacity style={styles.checkBtn}
                    onPress={handleSubmitAnswer}
                >
                    <Text style={styles.checkBtnText}>Kiểm tra</Text>
                </TouchableOpacity>
            </BottomSheet>

            {showFeedBack && (
                <FeedbackPanel
                    isVisible={showFeedBack}
                    isCorrect={isCorrect}
                    onContinue={() => {
                        setShowFeedback(false);
                        setSelectedOption(null);
                        setPrevSelectedOption(null);
                        setIsCorrect(null);
                        if (questionIndex < questions.length - 1) {
                            setQuestionIndex((prev) => prev + 1);
                        } else {
                            // console.log("Quiz Finished. Score:", score);
                            router.push({
                                pathname: "./result",
                                params: {
                                    correctQuestions: score.toString(),
                                    totalQuestions: questions.length.toString(),
                                },
                            });;
                        }
                    }}
                />
            )}
        </SafeAreaView>
    );
};

export default Question;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: colors.primary500
        backgroundColor: colors.gray50
    },
    main: {
        flex: 1,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md
    },
    header: {
        flexDirection: 'row',
        gap: spacing.md,
        alignItems: 'center'
    },
    cancelBtn: {
        padding: spacing.sm * .5,
        alignSelf: 'center',
        borderRadius: 5,
        backgroundColor: colors.primary50,
        borderColor: '#ddd',
        borderWidth: .5,
    },
    progressBarContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm
    },
    progressBarBackground: {
        flex: 1,
        height: 30,
        // backgroundColor: colors.gray50,
        backgroundColor: colors.gray300,
        borderRadius: 15,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary600,
        borderRadius: 5,
    },
    question: {
        marginTop: spacing.lg,
        // color: colors.gray50,
        color: colors.gray800,
        fontSize: fontSizes['2xl'],
        fontWeight: 600
    },
    videoContainer: {
        marginTop: spacing.lg,
        flex: 2.5,
    },
    videoView: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: colors.primary300
    },
    videoActionBtnContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.md,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    questionView: {
        paddingHorizontal: spacing.sm,
        marginTop: spacing.md,
        flex: 2
    },
    option: {
        // color: colors.gray50,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 15,
        borderWidth: .75,
        borderColor: colors.gray400,
        marginBottom: spacing.sm,
    },
    optionText: {
        color: colors.gray800,
        fontWeight: 500,
        fontSize: fontSizes.md * 1.2,
        textAlign: 'center'
    },
    optionTextSelected: {
        color: colors.primary400,
    },

    optionBtnSelected: {
        borderColor: colors.primary200
        // backgroundColor: colors.primary400,
        // paddingHorizontal: spacing.sm,
        // paddingVertical: spacing.xs,
        // borderRadius: 10
    },
    actionBtnContainer: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        flex: .25,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md
    },
    nextBtn: {
        width: 35,
        height: 35,
        borderRadius: 30,
        backgroundColor: colors.primary300,
        borderColor: colors.gray50,
        borderWidth: .75,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 5,
    },
    checkWrapper: {
        marginLeft: spacing.sm,
    },
    checkBtn: {
        backgroundColor: colors.primary600,
        paddingVertical: 12,
        // paddingHorizontal: 32,
        flex: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: colors.primary700,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 3,

        elevation: 4,
    },
    checkBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'uppercase',
    },
});