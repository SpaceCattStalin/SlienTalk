import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors } from '@/global/theme';

export const APP_ICON_SIZE = 12;
const size = APP_ICON_SIZE * 2;
const BUTTON_SIZE = size * 1.5;

type Props = {
    color: string;
    onPress?: () => void;
};

const BackButton = ({ color, onPress }: Props) => {
    const [buttonPressed, setButtonPressed] = useState(false);

    const handlePress = () => {
        if (onPress) {
            onPress(); // use custom handler if provided
        } else {
            router.back(); // fallback to default behavior
        }
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <ArrowLeft width={BUTTON_SIZE} height={BUTTON_SIZE} color={color} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({

});

export default BackButton;