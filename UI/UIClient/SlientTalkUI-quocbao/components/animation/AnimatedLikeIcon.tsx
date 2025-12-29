import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { LucideHeart } from 'lucide-react-native';

export const APP_ICON_SIZE = 12;
const baseSize = APP_ICON_SIZE * 2;

type Props = {
  primary: string;
  accent: string;
  onPress: () => void;
  sizeModifier?: number;
  isLiked?: boolean
};

const AnimatedLikeIcon = ({ primary, accent, onPress, sizeModifier = 1, isLiked }: Props) => {
  //const [isLiked, setIsLiked] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const iconSize = baseSize * sizeModifier;

  const handlePress = () => {
    // Scale animation
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.5, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();

    // setIsLiked(!isLiked);
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress} accessibilityRole="button" accessibilityLabel={isLiked ? 'Unlike' : 'Like'}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <LucideHeart
          size={iconSize}
          color={isLiked ? accent : primary}
          fill={isLiked ? primary : accent}
        />
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedLikeIcon;
