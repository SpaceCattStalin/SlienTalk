import { colors } from '@/global/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler';

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';

const INITIAL_BOX_SIZE = 20;
const SLIDER_WIDTH = 270;

type SliderProps = {
  maxValue: number;
  onChange: (value: number) => void;
};
const Slider = ({ maxValue, onChange }: SliderProps) => {
  const offset = useSharedValue(0);
  const boxWidth = useSharedValue(INITIAL_BOX_SIZE);
  // const MAX_VALUE = SLIDER_WIDTH - INITIAL_BOX_SIZE;
  const HANDLE_SIZE = 40;
  const TRACK_PADDING = 5;

  const MAX_OFFSET = SLIDER_WIDTH - HANDLE_SIZE - TRACK_PADDING * 2;

  const pan = Gesture.Pan().onChange((event) => {
    let newOffset = offset.value + event.changeX;
    if (newOffset < 0) newOffset = 0;
    if (newOffset > MAX_OFFSET) newOffset = MAX_OFFSET;
    offset.value = newOffset;

    boxWidth.value = newOffset + HANDLE_SIZE;

    const progress = Math.round((newOffset / MAX_OFFSET) * maxValue);
    runOnJS(onChange)(progress);
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: boxWidth.value,
    };
  });

  const sliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.sliderTrack}>
        <Animated.View style={[styles.progressBox, progressStyle]} />

        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.sliderHandle, sliderStyle]} />
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // gap: 32,
    alignSelf: 'stretch'
  },
  sliderTrack: {
    width: SLIDER_WIDTH,
    height: 42,
    // backgroundColor: colors.gray500,
    backgroundColor: 'rgba(128,128,128,0.5)',
    borderRadius: 10,
    justifyContent: 'center',
    padding: 5,
  },
  sliderHandle: {
    width: 40,
    height: 35,
    backgroundColor: '#f8f9ff',
    borderRadius: 5,
    position: 'absolute',
    left: 5,
  },
  progressBox: {
    height: 35,
    backgroundColor: colors.primary500,
    borderRadius: 5,
  },
});

export default Slider;