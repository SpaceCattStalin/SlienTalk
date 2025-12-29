import { Stack } from "expo-router";
import React from "react";

export default function PracticeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Practice" }} />
      {/* <Stack.Screen name="mode" options={{ title: "Mode" }} /> */}
    </Stack>
  );
}
