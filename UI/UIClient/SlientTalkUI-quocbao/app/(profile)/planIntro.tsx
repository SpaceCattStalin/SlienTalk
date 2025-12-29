import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSizes, spacing } from '@/global/theme';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';

import Camera from '@/assets/images/camera.svg';
import Speech from '@/assets/images/speech.svg';
// import AdFree from '@/assets/images/ad-free.svg';
import BackButton from '@/components/BackButton';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';

type Benefit = {
    title: string,
    subtitle?: string;
    icon: React.ComponentType<any>;
};
const NoAdsIcon = () => (
  <Image 
    source={require("../../assets/images/ad.png")} 
    style={{ width: 60, height: 60 }} 
    resizeMode="contain" 
  />
);
const benefits: Benefit[] = [
    {
        title: 'Dịch bằng camera',
        subtitle:
            'Sử dụng camera để dịch dấu hiệu trong thời gian thực không giới hạn',
        icon: Camera
    },
    {
        title: 'Lưu từ không giới hạn',
        subtitle:
            'Không giới hạn số bộ sưu tập',
        icon: Speech
    },
    {
        title: 'Không bị gián đoạn',
        subtitle:
            'Sử dụng ứng dụng mà không bị gián đoạn.',
        icon:NoAdsIcon
    },
];
const PlanIntro = () => {
    return (
        <SafeAreaView style={styles.container}>
            <BackButton color={colors.gray200} />
            <View style={styles.main}>
                <Animated.View
                    entering={FadeInLeft.duration(500).springify()}
                >
                    <Text
                        style={{
                            fontSize: fontSizes['2xl'],
                            fontWeight: 700,
                            color: colors.gray50
                        }}>
                        Nâng cấp lên Premium
                    </Text>
                </Animated.View>

                <Animated.View
                    entering={FadeInLeft.delay(200).duration(500).springify()}
                >

                    <Text style={styles.subtitle}>
                        Trải nghiệm đầy đủ tất cả tính năng
                    </Text>
                </Animated.View>

                {benefits.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <Animated.View
                            key={index}
                            style={styles.feature}
                            entering={FadeInDown.delay(index * 100).duration(500)}
                        >
                            <Icon
                                width={80}
                                height={80} />
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    color: colors.gray50,
                                    fontSize: fontSizes.lg,
                                    fontWeight: 600,
                                    marginBottom: spacing.sm
                                }}>{item.title}</Text>
                                <Text style={{
                                    color: colors.gray100,
                                    lineHeight: spacing.md * 1.2,
                                    wordWrap: 'wrap'
                                }}>
                                    {item.subtitle}
                                </Text>
                            </View>
                        </Animated.View>
                    );
                })}

                <Animated.View entering={FadeInDown.delay(500).duration(500)}>
                    <TouchableOpacity style={styles.btn} onPress={() => router.push('./plan')}>
                        <Text style={{
                            color: colors.gray100,
                            fontWeight: 600,
                            fontSize: fontSizes.md
                        }}>
                            Nâng cấp lên gói Premium
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

export default PlanIntro;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: spacing.lg * 1.25,
        paddingHorizontal: spacing.md,
        backgroundColor: '#2463C9'
    },
    main: {
        marginTop: spacing.md,
        flex: 1
    },
    subtitle: {
        fontSize: 16,
        color: colors.gray50,
        marginBottom: spacing.lg,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        backgroundColor: '#0B3478',
        borderRadius: 10,
        borderWidth: .5,
        borderColor: colors.gray50,
        marginBottom: 10,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,

        elevation: 2,
    },
    btn: {
        // flexGrow: 0,
        // alignSelf: 'center',
        // paddingHorizontal: 24,
        marginTop: spacing.lg * 2,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: "#F97316",
    }
});