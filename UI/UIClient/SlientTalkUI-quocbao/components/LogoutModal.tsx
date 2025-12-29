import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { colors, fontSizes, spacing } from '@/global/theme';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import { AuthContext } from '@/context/AuthProvider';

type Prop = {
    isVisible: boolean;
    onCancel: () => void;
};

const LogoutModal = ({ isVisible, onCancel }: Prop) => {
    const offsetY = useSharedValue(300);
    const { signOut } = useContext(AuthContext);

    useEffect(() => {
        if (isVisible) {
            offsetY.value = withTiming(0, { duration: 300 });
        } else {
            offsetY.value = withTiming(300, { duration: 300 });
        }
    }, [isVisible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: offsetY.value }],
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Text style={styles.title}>Đăng xuất</Text>

            <View style={styles.divider} />

            <Text style={styles.message}>Bạn có chắc muốn đăng xuất?</Text>

            <View style={{
                flexDirection: 'row',
                flex: 1,
                marginTop: spacing.md,
                gap: spacing.lg,
                paddingHorizontal: spacing.lg
            }}>
                <TouchableOpacity style={styles.button} onPress={onCancel}>
                    <Text style={{ textAlign: 'center' }}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.confirmBtn]}
                    onPress={() => signOut()}
                >
                    <Text
                        style={{ textAlign: 'center', color: colors.gray50, fontWeight: 500 }}
                    >
                        Đăng xuất
                    </Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

export default LogoutModal;

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.5,
        padding: spacing.md,
        borderColor: '#ddd',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        zIndex: 100
    },
    divider: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        marginVertical: spacing.sm,
    },
    title: {
        fontWeight: 400,
        fontSize: fontSizes.md,
        textAlign: 'center',
        paddingVertical: spacing.sm
    },
    message: {
        marginVertical: spacing.sm,
        textAlign: 'center'
    },
    button: {
        paddingVertical: spacing.sm,
        borderWidth: .5,
        borderRadius: 20,
        alignSelf: 'center',
        // minWidth: '20%'
        flex: 1
    },
    confirmBtn: {
        backgroundColor: colors.primary500
    }
});