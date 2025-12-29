import { Stack, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import './global.css';
import { AuthProvider } from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import ThemedView from "@/components/ThemedView";
import { NavProvider } from "@/context/NavContext";
import MainLayout from "./(main)/_layout";
import Home from "./(main)/home";
import WordScreen from "./(dictionary)/word/[word]";
import { LogBox } from 'react-native';


const RootNavigation = () => {
  const { authState } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
      <Stack.Screen name="index" />
    </Stack>

  );
};


export default function RootLayout() {
  LogBox.ignoreLogs([
    "SafeAreaView has been deprecated",
  ]);
  console.warn = () => { };
  LogBox.ignoreAllLogs(true);
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavProvider>
          <RootNavigation />
        </NavProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

