import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { colors, spacing } from '@/global/theme';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";

type BottomSheetProps = {
    isVisible: boolean;
    onClose?: () => void;
    children: React.ReactNode;
};

const BottomSheet = ({ isVisible, onClose, children }: BottomSheetProps) => {
    const offsetY = useSharedValue(300);

    useEffect(() => {
        if (isVisible) {
            offsetY.value = withTiming(0, { duration: 300 });
        } else {
            offsetY.value = withTiming(300, { duration: 300 });
        }
    }, [isVisible, offsetY]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: offsetY.value }],
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            {/* <View style={styles.content}> */}
            {children}
            {/* </View> */}
        </Animated.View>
    );
};

export default BottomSheet;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        // borderWidth: .75,
        // borderColor: colors.gray400,
        // backgroundColor: colors.gray50,
        padding: spacing.md * 1.5,
        zIndex: 100,
    },
    content: {
        flexDirection: 'column',
        gap: spacing.md,
    },
});
