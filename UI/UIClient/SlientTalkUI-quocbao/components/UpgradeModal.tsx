import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/global/theme';

type UpgradeModalProps = {
    visible: boolean;
    onClose: () => void;
    currentWords: number;
    limit: number;
    onUpgrade: () => void;
};

const UpgradeModal: React.FC<UpgradeModalProps> = ({ visible, onClose, currentWords, limit, onUpgrade }) => {
    const progress = currentWords / limit;
    const animatedWidth = useRef(new Animated.Value(0)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: progress,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [progress]);

    useEffect(() => {
        // Lặp shimmer effect
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const barWidth = animatedWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 300], // shimmer chạy ngang
    });

    const barColor = progress > 0.8 ? 'red' : progress > 0.5 ? 'orange' : 'green';

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <LottieView
                        source={require('@/assets/lottie/startup.json')}
                        autoPlay
                        loop
                        style={{ width: 150, height: 150 }}
                    />

                    <Text style={styles.title}>Bạn đã lưu {currentWords}/{limit} từ</Text>
                    <Text style={styles.subtitle}>Gói Free chỉ cho phép tối đa {limit} từ</Text>

                    {/* Progress bar */}
                    <View style={styles.progressBar}>
                        <Animated.View
                            style={[
                                styles.progress,
                                {
                                    width: barWidth,
                                    backgroundColor: barColor,
                                },
                            ]}
                        >
                            {/* Shimmer layer */}
                            <Animated.View
                                style={{
                                    ...StyleSheet.absoluteFillObject,
                                    transform: [{ translateX: shimmerTranslate }],
                                }}
                            >
                                <LinearGradient
                                    colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{ flex: 1 }}
                                />
                            </Animated.View>
                        </Animated.View>
                    </View>

                    <TouchableOpacity style={styles.upgradeBtn} onPress={onUpgrade}>
                        <Text style={styles.upgradeText}>Nâng cấp ngay</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Text style={styles.closeText}>Để sau</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default UpgradeModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        width: '85%',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary800,
        marginTop: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    progressBar: {
        width: '100%',
        height: 12,
        backgroundColor: '#eee',
        borderRadius: 6,
        marginVertical: 10,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        borderRadius: 6,
        overflow: 'hidden',
    },
    upgradeBtn: {
        backgroundColor: colors.primary500,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginTop: 10,
    },
    upgradeText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    closeBtn: {
        marginTop: 10,
    },
    closeText: {
        color: '#666',
        fontSize: 14,
    },
});
