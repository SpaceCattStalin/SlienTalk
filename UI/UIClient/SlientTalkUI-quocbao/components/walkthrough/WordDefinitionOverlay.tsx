import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '@/global/theme';
import Animated, { FadeInDown, FadeOutUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { IOverlayComponentProps } from 'react-native-interactive-walkthrough';

const WordDefinitionOverlay = ({
  next,
  step: { mask },
}: IOverlayComponentProps) => {
  const scale = useSharedValue(1);

  return (
    <View
      style={{
        ...styles.container,
        top: mask.y + mask.height,
        left: 50
      }}
    >
      <View style={styles.pointer} />

      <View style={styles.overlay}>
        <Text style={styles.subtitle}>
          Bạn có thể xem định nghĩa của từ ở đây
        </Text>
        <Pressable
          onPressIn={() => { scale.value = withSpring(0.95); }}
          onPressOut={() => { scale.value = withSpring(1); }}
          onPress={next}
        >
          <View style={[
            styles.button,
          ]}
          >
            <Text style={styles.buttonText}>
              Tiếp theo
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default WordDefinitionOverlay;

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
    marginLeft: 20, // move pointer horizontally
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
    marginBottom: 12,
  },
  button: {
    marginTop: 6,
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});