import { Stack } from "expo-router";
import React from "react";
import Onboarding from 'react-native-onboarding-swiper';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" options={{ title: "Onboarding" }} />
    </Stack>
  );
}
