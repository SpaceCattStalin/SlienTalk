import { Stack } from "expo-router";
import React from "react";

export default function LogoLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="logo" options={{ title: "Logo" }} />
    </Stack>
  );
}
