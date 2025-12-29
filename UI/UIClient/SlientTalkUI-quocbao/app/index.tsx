import { StyleSheet, Text, View, LogBox } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '@/global/theme';
import AnimatedTyping from '@/components/animation/AnimatedTyping';
import { useRoute } from '@react-navigation/native';
import { Redirect, router } from 'expo-router';
import Onboarding from './(onboarding)/onboarding';
import TestRender from '../components/animation/testRender';
import ModelViewer from '../components/animation/ModelViewer';
import DeviceInfo from 'react-native-device-info';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from 'expo-router/build/global-state/router-store';

type Prop = {
    onDone: () => void;
};
const storeData = async (key: string, value: boolean) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error("Lỗi khi lưu data", e);
    }
};

const retrieveData = async (key: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);

        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error("Lỗi khi lấy data", e);
    }
};
const Index = () => {
    LogBox.ignoreLogs([
        "SafeAreaView has been deprecated",
    ]);
    console.warn = () => { };
    LogBox.ignoreAllLogs(true);

    const [showOnboarding, setShowOnboarding] = useState(false);
    const [readyToRedirect, setReadyToRedirect] = useState(false);
    const [splashDone, setSplashDone] = useState(false);

    useEffect(() => {

        // if (retrieveData === null) {
        //     setShowOnboarding(true);
        //     storeData("seenOnboarding", true);
        // } else {
        //     setReadyToRedirect(true);
        // }

        const timer = setTimeout(() => {
            setSplashDone(true);

            // if (hasSeenOnboarding) {
            //     setReadyToRedirect(true);
            // } else {
            //     setShowOnboarding(true);
            // }

            if (retrieveData === null) {
                setShowOnboarding(true);
                storeData("seenOnboarding", true);
            } else {
                setReadyToRedirect(true);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (showOnboarding) {
        return (
            <Onboarding onDone={() => {
                setShowOnboarding(false);
                setReadyToRedirect(true);
            }} />

            // <TestRender/>
        );
    }

    if (readyToRedirect) {
        // return <Redirect href="/home" />;
        return <Redirect href="/login" />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <AnimatedTyping textToType={["SilenTalk"]} displayLogo={true} />
            </View>
            {/* <Redirect href="/(auth)/login" />; */}
        </View>
    );
};


export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary300,
        justifyContent: 'center'
    },
    main: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6
    }
});