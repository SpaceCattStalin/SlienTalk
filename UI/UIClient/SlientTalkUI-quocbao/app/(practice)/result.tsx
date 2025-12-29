import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { Check } from "lucide-react-native";

import { colors, fontSizes, spacing } from '@/global/theme';
import NavBar from '@/components/NavBar';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';

const Result = () => {
    const { correctQuestions, totalQuestions } = useLocalSearchParams();

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#0B3478', '#2877ED']}
                locations={[0, 0.5]}
                start={{ x: 1, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                <ConfettiCannon count={200}
                    origin={{ x: -10, y: 0 }}
                    fallSpeed={4000}
                    autoStart={true}
                    fadeOut={true}
                />
            </View>

            <View style={styles.header}>
                <View style={styles.checkBtn}>
                    <Check size={50} strokeWidth={4} color={colors.primary300} />
                </View>
                <Text style={styles.title}>Làm tốt lắm!</Text>
                <Text style={styles.subTitle}>
                    Bạn đã trả lời đúng {correctQuestions} trên tổng số {totalQuestions} câu hỏi!
                </Text>
            </View>

            <NavBar />
        </SafeAreaView>
    );
};

export default Result;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary400,
    },
    checkBtn: {
        padding: 15,
        alignSelf: 'center',
        backgroundColor: colors.gray50,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        marginTop: spacing.md,
        fontSize: fontSizes['3xl'],
        color: colors.gray50,
        fontWeight: 700
    },
    subTitle: {
        marginTop: spacing.sm,
        fontSize: fontSizes.xl,
        color: colors.gray50,
        fontWeight: 600,
        textAlign: 'center',
        paddingHorizontal: spacing.lg * 2
    },
    header: {
        flex: .5,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    main: {
        flex: 1,
    }
});