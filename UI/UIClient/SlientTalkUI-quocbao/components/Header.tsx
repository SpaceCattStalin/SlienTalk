import { Text, View, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontSizes, spacing } from '@/global/theme';
import Logo from '@/assets/images/logo.svg';

type HeaderProps = {
    title?: string;
    onPressRight?: () => void;
};

const Header = ({ title, onPressRight }: HeaderProps) => {

    return (
        <View style={styles.container}>

            <View className='flex-row gap-1'>
                <Logo width={35} height={35} />
                <Text style={styles.title}>SilenTalk</Text>
            </View>


            {/* Tiêu đề ở giữa */}
            {/* {title && (
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>
            )} */}

            {/* Nút bên phải */}
            {/* <TouchableOpacity onPress={onPressRight} style={styles.rightBtn}>
                <Image
                    source={require('@/assets/images/notification.png')}
                    style={styles.icon}
                />
            </TouchableOpacity> */}
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray100,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",

        ...Platform.select({
            android: {
                elevation: 2
            }
        })
    },
    logo: {
        height: 28,
        aspectRatio: 1,
        resizeMode: "contain",
    },
    title: {
        alignSelf: 'center',
        fontSize: fontSizes.xl,
        fontWeight: "600",
        color: colors.primary500,
    },
    rightBtn: {
        padding: 8,
    },
    icon: {
        height: 22,
        width: 22,
        resizeMode: "contain",
        tintColor: "#fff",
    },
});
