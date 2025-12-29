import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '@/global/theme';
import Animated, { FadeInDown, FadeOutUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { IOverlayComponentProps } from 'react-native-interactive-walkthrough';
import { router } from 'expo-router';

const WordDefinitionLikeButtonOverlay = ({
    next,
    step: { mask },
}: IOverlayComponentProps) => {

    return (
        <View
            style={{
                ...styles.container,
                top: mask.y + mask.height,
                right: -35
            }}
        >
            <View style={styles.pointer} />
            <View style={styles.overlay}>
                <Text style={styles.subtitle}>
                    Hãy thử lưu ký hiệu này lại nào!
                </Text>
            </View>
        </View>
    );
};

export default WordDefinitionLikeButtonOverlay;

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-start",
        position: 'absolute'
    },
    pointer: {
        width: 0,
        height: 0,
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderBottomWidth: 16,
        borderStyle: "solid",
        backgroundColor: "transparent",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: colors.primary300, // same as bubble background
        marginLeft: 170, // move pointer horizontally
    },
    overlay: {
        backgroundColor: colors.primary300,
        padding: 16,
        borderRadius: 24,
        maxWidth: "85%",
        alignSelf: "flex-start",
        marginTop: -1,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 6,
        color: "white",
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 21,
        color: "white",
        height: 50
    }
});