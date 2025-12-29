import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';

import Home from '@/assets/images/home.svg';
import Book from '@/assets/images/book.svg';
import Search from '@/assets/images/search.svg';
import Profile from '@/assets/images/profile.svg';
// import Wave from '@/assets/images/wave.svg';
import Scan from '@/assets/images/scan.svg';
import { colors, fontSizes, spacing } from '../global/theme';
import { Link } from 'expo-router';
import { useNav } from '@/context/NavContext';
import { useWalkthroughStep } from 'react-native-interactive-walkthrough';
import TranslateScreen5Overlay from './walkthrough/TranslateScreenOverlay5';

type NavbarProps = {
    style?: object;
    // activeTab: string;
    // setActiveTab: (tab: string) => void;
};

const ICON_SIZE = 20;

const NavBar = ({ style }: NavbarProps) => {
    // const [activeTab, setActiveTab] = useState("home");
    const { activeTab, setActiveTab } = useNav();

    // const { onLayout: step16OnLayout, goTo, start } = useWalkthroughStep({
    //     number: 16,
    //     fullScreen: false,
    //     OverlayComponent: TranslateScreen5Overlay,
    // });


    // useEffect(() => {
    //     goTo(16);
    // }, [start, goTo]);

    return (
        <View style={{ ...styles.container, ...style }}>
            <Link href="/(main)/home" asChild>
                <TouchableOpacity style={styles.button} onPress={() => setActiveTab("home")}>
                    {/* <View style={{ backgroundColor: activeTab === "home" ? "red" : "transparent", ...styles.wrapper }}> */}
                    <View style={styles.wrapper}>
                        <Home
                            width={ICON_SIZE}
                            height={ICON_SIZE}
                            stroke={activeTab === "home" ? colors.primary400 : colors.gray500}
                            fill={activeTab === "home" ? colors.primary400 : colors.gray500}
                        />
                        <Text style={{ color: activeTab === "home" ? colors.primary400 : colors.gray500, ...styles.text }}>Trang chủ</Text>
                    </View>
                </TouchableOpacity>
            </Link>

            {/* <Link href="/(practice)" asChild>
                <TouchableOpacity style={styles.button} onPress={() => setActiveTab("practice")}>
                    <View style={styles.wrapper}>
                        <Book
                            width={ICON_SIZE}
                            height={ICON_SIZE}
                            stroke={activeTab === "practice" ? colors.primary400 : colors.gray500}
                        />
                        <Text style={{ color: activeTab === "practice" ? colors.primary400 : colors.gray500, ...styles.text }}>Luyện tập</Text>
                    </View>
                </TouchableOpacity>
            </Link> */}

            {/* <Button style={styles.button}>
                <Wave width={ICON_SIZE} height={ICON_SIZE} />
            </Button> */}

            <Link href="/(translate)" asChild>
                <TouchableOpacity style={styles.translateBtn} onPress={() => setActiveTab("translate")}>
                    <View style={{ ...styles.wrapper, }}>
                        <Scan
                            width={ICON_SIZE}
                            height={ICON_SIZE}
                            stroke={activeTab === "translate" ? colors.primary400 : colors.gray500}
                        />
                        <Text style={{ color: activeTab === "translate" ? colors.primary400 : colors.gray500, ...styles.text }}>
                            Phiên dịch
                        </Text>
                    </View>
                </TouchableOpacity>
            </Link>

            <Link href="/(dictionary)" asChild>
                <TouchableOpacity style={styles.button} onPress={() => setActiveTab("dictionary")}>
                    <View style={{ ...styles.wrapper, }}>
                        <Search
                            width={ICON_SIZE}
                            height={ICON_SIZE}
                            stroke={activeTab === "dictionary" ? colors.primary400 : colors.gray500}
                        />
                        <Text style={{ color: activeTab === "dictionary" ? colors.primary400 : colors.gray500, ...styles.text }}>Từ điển</Text>
                    </View>
                </TouchableOpacity>
            </Link>

            <Link href="/(profile)" asChild>
                <TouchableOpacity style={styles.button} onPress={() => setActiveTab("profile")}>
                    <View style={{ ...styles.wrapper }}>
                        <Profile
                            width={ICON_SIZE}
                            height={ICON_SIZE}
                            stroke={activeTab === "profile" ? colors.primary400 : colors.gray500}
                        />
                        <Text style={{ color: activeTab === "profile" ? colors.primary400 : colors.gray500, ...styles.text }}>Tài khoản</Text>
                    </View>
                </TouchableOpacity>
            </Link>
        </View>
    );
};

export default NavBar;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        height: 70
    },
    button: {

    },
    translateBtn: {
        // position: 'relative',
        // bottom: 20,
        // backgroundColor: colors.gray50,
        // padding: spacing.sm,
        // borderRadius: 999,
        // borderColor: '#ddd',
        // borderWidth: 1
    },
    wrapper: {
        borderRadius: 10,
        padding: spacing.sm,
        justifyContent: "center",
        alignItems: 'center'
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "contain"
    },
    text: {
        fontSize: fontSizes.sm,
        fontWeight: 500
    },
    link: {
        position: 'absolute'
    }
});