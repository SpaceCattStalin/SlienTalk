import { colors } from "@/global/theme";
import React, { ReactNode, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Onboarding from "react-native-onboarding-swiper";

export type OnboardingPage = {
    title?: string;
    subtitle?: string;
    image: ReactNode;
    backgroundColor?: string;
};

type Props = {
    pages: OnboardingPage[];
    onDone: () => void;
    onSkip?: () => void;
};

export default function OnboardingScreen({ pages, onDone, onSkip}: Props) {
    return (
        <Onboarding
            bottomBarColor={colors.primary50}
            nextLabel={<View><Text style={styles.btnText}>Tiếp theo</Text></View>}
            skipLabel={<View><Text style={styles.btnText}>Bỏ qua</Text></View>}
            bottomBarHeight={170}
            pages={pages.map((page) => ({
                backgroundColor: page.backgroundColor || "#fff",
                image: <View style={styles.imageWrapper}>{page.image}</View>,
                title: page.title ? <Text style={styles.title}>{page.title}</Text> : "",
                subtitle: page.subtitle ? <Text style={styles.subtitle}>{page.subtitle}</Text> : "",
            }))}
            onDone={onDone}
            onSkip={onSkip || onDone}
        />
    );
}

const styles = StyleSheet.create({
    logoWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    imageWrapper: {
        width: 250,
        height: 250,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 10,
        // color: colors.gray800
        color: colors.primary500
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        paddingHorizontal: 20,
        color: colors.gray800
    },
    btnText: {
        fontSize: 14,
        textAlign: "center",
        color: colors.gray600
    }
});
