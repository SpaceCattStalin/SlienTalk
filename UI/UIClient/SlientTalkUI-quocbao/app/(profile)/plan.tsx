import { Linking, StyleSheet, Text, TouchableOpacity, View, NativeModules, NativeEventEmitter, Alert, ActivityIndicator, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSizes, spacing } from '@/global/theme';
import BackButton from '@/components/BackButton';
import { Ionicons } from '@expo/vector-icons';
import NavBar from '@/components/NavBar';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { createPayment, getCurrentPlan, paymentCallback } from '@/services/api';
import { CreatePaymentRequest, CreatePaymentResponse } from '@/types/Types';
import ResultModal from '@/components/ResultModal';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useZaloPay } from '../../hooks/useZaloPay';
const { PayZaloBridgeModule } = NativeModules;
// const payZaloEmitter = new NativeEventEmitter(PayZaloBridgeModule);
const payZaloEmitter = new NativeEventEmitter(PayZaloBridgeModule);

const PlanCard = ({
    title,
    subtitle,
    price,
    discount,
    features,
    planType,
    currentPlan,
    onSubscribe,
    onApply,
}: {
    title: string;
    subtitle: string;
    price?: string;
    discount?: string;
    features: string[];
    planType: string;
    currentPlan: string | null;
    onSubscribe?: () => void;
    onApply?: () => void;
}) => {
    const isCurrent = currentPlan === planType;

    return (
        <Animated.View
            style={styles.card}
            entering={FadeInDown.duration(500)}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{title}</Text>
            </View>

            {price && <Text style={styles.price}>{price}</Text>}

            <View style={{ marginTop: spacing.sm }}>
                {features.map((f, idx) => (
                    <Text key={idx} style={styles.feature}>
                        • {f}
                    </Text>
                ))}
            </View>

            <View style={{ marginTop: spacing.lg }}>
                {isCurrent ? (
                    <TouchableOpacity style={styles.applyBtn} disabled>
                        <Text style={styles.applyText}>Gói hiện tại</Text>
                    </TouchableOpacity>
                ) : (
                    planType === "PREMIUM" && (
                        <TouchableOpacity style={styles.subscribeBtn} onPress={onSubscribe}>
                            <Text style={styles.subscribeText}>Đăng ký</Text>
                        </TouchableOpacity>
                    )
                )}
            </View>
        </Animated.View>);
};

const retrieveData = async (key: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);

        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error("Lỗi khi lấy data", e);
    }
};
const PaymentPlans = () => {
    const [loading, setLoading] = useState(false);
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<string | null>(null);
    const [isPlanLoading, setIsPlanLoading] = useState(false);
    const { pay, subscribe } = useZaloPay();

    const getPlan = async () => {
        try {
            setIsPlanLoading(true);
            const res = await getCurrentPlan();

            if (res !== null) {
                setCurrentPlan(res.data.planId);
            }
        } catch (err: any) {
            console.log(err);
        } finally {
            setIsPlanLoading(false);
        }
    };

    useEffect(() => {
        getPlan();
    }, []);

    const startPayment = async (zpToken: string) => {
        try {
            const res = await PayZaloBridgeModule.payOrder(zpToken, "silentalk://zp");

            console.log('payOrder result', res);
        } catch (err) {
            console.log(err);
            console.warn('payOrder err', err);
        }
    };

    const createZaloPayment = async () => {
        const email = await retrieveData("email");
        try {
            setLoading(true);
            const request: CreatePaymentRequest = {
                userId: "",
                amount: 69000,
                description: `Đăng kí SlienTalk Premium \n Cho người dùng ${JSON.stringify(email)}`,
                itemName: "SilentTalk Premium 1 Tháng"

            };
            const res: CreatePaymentResponse = await createPayment(request);

            if (res.zpTransToken) {
                await startPayment(res.zpTransToken);
            }

        } catch (err: any) {
            console.log("Lỗi khi tạo đơn hàng thanh toán!", err);
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     const sub = payZaloEmitter.addListener('EventPayZalo', (data) => {
    //         setLoading(false);

    //         //console.log(data);

    //         router.navigate('/plan');
    //         if (data.errorCode === 0) {
    //             setIsResultVisible(true);
    //         }
    //     });

    //     return () => sub.remove();
    // }, []);
    useEffect(() => {
        const unsubscribe = subscribe((data) => {
            console.log("ZaloPay Event:", data);

            switch (data.errorCode) {
                case 0:
                    setIsResultVisible(true);
                    router.push("/plan");
                    break;

                case 1:
                    // PAYMENT_APP_NOT_FOUND
                    Alert.alert(
                        "ZaloPay chưa được cài đặt",
                        "Bạn cần cài ứng dụng ZaloPay để tiếp tục thanh toán.",
                        [
                            {
                                text: "Cài đặt ngay",
                                onPress: () => {
                                    const url = Platform.select({
                                        android: "market://details?id=vn.zalopay",
                                        ios: "itms-apps://itunes.apple.com/app/id1168873121",
                                    });
                                    Linking.openURL(url!);
                                },
                            },
                            { text: "Hủy", style: "cancel" },
                        ]
                    );
                    break;

                case 4:
                    Alert.alert("Đã hủy", "Bạn đã hủy giao dịch.");
                    break;

                default:
                    Alert.alert("Lỗi", `Thanh toán thất bại (mã lỗi: ${data.errorCode})`);
                    break;
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <SafeAreaView style={styles.container}>

            <View style={{
                flex: 1, paddingTop: spacing.lg * 1.25,
                paddingHorizontal: spacing.md,
            }}>

                <BackButton color={colors.primary800} />
                <View style={{ paddingHorizontal: spacing.md }}>
                    <Animated.View entering={FadeInLeft.duration(500).springify()}>
                        <Text style={styles.header}>Chọn gói phù hợp cho bạn</Text>
                    </Animated.View>


                    <PlanCard
                        title="Gói Cơ bản"
                        subtitle="Miễn phí trọn đời"
                        features={[
                            'Truy cập Từ điển Ngôn ngữ Ký hiệu',
                            'Dùng chế độ Phiên dịch với số lượng giới hạn',
                        ]}
                        planType="FREE"
                        currentPlan={currentPlan}
                    />

                    <PlanCard
                        title="Gói Cao cấp"
                        subtitle="Người khiếm thính, sinh viên ngành Giáo dục, Y tế và Công tác xã hội"
                        price="69.000 VND/tháng"
                        discount="Giảm 20%"
                        features={[
                            'Lưu không giới hạn từ vào bộ sưu tập',
                            'Dịch ngôn ngữ ký hiệu theo thời gian thực',
                            'Không bị quảng cáo gián đoạn',
                            'Hỗ trợ ưu tiên và dùng thử miễn phí 1 tháng',
                        ]}
                        planType="PREMIUM"
                        currentPlan={currentPlan}
                        onSubscribe={createZaloPayment}
                    />
                </View>

            </View>
            <View>
                <NavBar />
            </View>

            <ResultModal
                visible={isResultVisible}
                onClose={() => {
                    setIsResultVisible(false);
                }}
                state={'payment'}
            />


            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={colors.primary500} />
                </View>
            )}
            {isPlanLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={colors.primary500} />
                    <Text style={{ marginTop: 8, color: colors.gray700 }}>
                        Đang tải thông tin gói...
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default PaymentPlans;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // paddingTop: spacing.lg * 1.25,
        // paddingHorizontal: spacing.md,
        //backgroundColor: '#2463C9',
        flex: 1,
        backgroundColor: colors.gray200,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginTop: spacing.sm,
        fontSize: fontSizes['2xl'],
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: spacing.lg,
        color: colors.gray700,
    },
    card: {
        backgroundColor: colors.gray50,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.lg,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    cardTitle: {
        fontSize: fontSizes.xl,
        fontWeight: '700',
        color: colors.gray800,
    },
    price: {
        fontSize: fontSizes.md,
        fontWeight: '600',
        color: colors.primary500,
        marginBottom: spacing.xs,
    },
    discount: {
        fontSize: fontSizes.sm,
        fontWeight: '600',
        color: colors.primary600,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: fontSizes.sm,
        color: colors.gray600,
    },
    feature: {
        fontSize: fontSizes.sm,
        color: colors.gray800,
        marginBottom: spacing.sm,
    },
    subscribeBtn: {
        backgroundColor: '#F97316',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    subscribeText: {
        color: colors.gray50,
        fontWeight: '600',
        fontSize: fontSizes.md,
    },
    applyBtn: {
        backgroundColor: colors.gray300,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    applyText: {
        color: colors.gray700,
        fontWeight: '500',
        fontSize: fontSizes.sm,
    },
});

