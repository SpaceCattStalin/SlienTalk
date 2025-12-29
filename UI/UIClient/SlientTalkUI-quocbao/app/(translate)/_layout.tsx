import { Stack } from "expo-router";
import React from "react";

export default function TranslateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Translate" }} />
    </Stack>
  );
}
