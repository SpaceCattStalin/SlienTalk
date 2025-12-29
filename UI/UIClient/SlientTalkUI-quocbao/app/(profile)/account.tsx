import { StyleSheet, Text, TextInput, View, Pressable, Image, ActivityIndicator } from 'react-native';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSizes, spacing } from '@/global/theme';
import { ChevronLeft } from 'lucide-react-native';

import Avatar from '@/assets/images/avatar.svg';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import NavBar from '@/components/NavBar';

import EditPen from '@/assets/images/edit-icon.svg';
import BackButton from '@/components/BackButton';
import AnimatedButton from '@/components/animation/AnimatedButton';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInRight, FadeOutDown } from 'react-native-reanimated';
import { ApiResponse, UserInfo } from '@/types/Types';
import { getUserInfo, updateUserInfo, uploadProfileImage } from '@/services/api';
import ResultModal from '@/components/ResultModal';
import ErrorModal from '@/components/ErrorModal';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';

const Account = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [errors, setErrors] = useState<{ name?: string, phoneNumber?: string; }>({});
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [saving, setSaving] = useState(false);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             setLoadingUser(true);
    //             const res: UserInfo = await getUserInfo();
    //             if (res != null) {
    //                 setName(res.name);
    //                 setPhoneNumber(res.phoneNumber);
    //                 setAvatarUri(res.imgUrl ?? "");
    //             }
    //         } catch (err: any) {
    //             console.log("Lỗi khi lấy thông tin user!", err);
    //             setErrorModalVisible(true);
    //         } finally {
    //             setLoadingUser(false);
    //         }
    //     };

    //     fetchUser();
    // }, []);

    const fetchUser = async () => {
        try {
            setLoadingUser(true);
            const res: UserInfo = await getUserInfo();
            if (res != null) {
                setName(res.name);
                setPhoneNumber(res.phoneNumber);
                // setAvatarUri(res.imgUrl ?? "");
                setAvatarUri(res.imgUrl ? `${res.imgUrl}?t=${Date.now()}` : "");
            }
        } catch (err) {
            console.log("Lỗi khi lấy thông tin user!", err);
            setErrorModalVisible(true);
        } finally {
            setLoadingUser(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUser();
        }, [])
    );

    const validate = () => {
        let valid = true;
        let newErrors: { name?: string; phoneNumber?: string; } = {};

        if (!name.trim()) {
            newErrors.name = "Tên không được để trống";
            valid = false;
        }

        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = "Số điện thoại không được để trống";
            valid = false;
        } else if (phoneNumber.length < 10) {
            newErrors.phoneNumber = "Số điện thoại phải đủ 10 số";
            valid = false;
        } else if (phoneNumber.length > 10) {
            newErrors.phoneNumber = "Số điện thoại không được quá 10 số";
            valid = false;
        }


        setErrors(newErrors);
        return valid;
    };

    const handleSave = async () => {
        try {
            if (!validate()) return;
            setSaving(true);
            let success = false;

            if (avatarUri) {
                const res = await uploadProfileImage(avatarUri);
                if (res.isSuccess) {
                    success = true;
                    setAvatarUri(res.ImageUrl);
                }
            }

            if (name || phoneNumber) {
                const res: ApiResponse<UserInfo> = await updateUserInfo(name, phoneNumber);
                if (res) {
                    success = true;
                    setIsEditing(false);
                }
            }

            if (success) {
                await fetchUser();
                setResultModalVisible(true);
            }

        } catch (err) {
            console.log(err);
            setErrorModalVisible(true);
        } finally {
            setSaving(false);
        }
    };


    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setAvatarUri(result.assets[0].uri);
        }
    };

    if (loadingUser) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary500} />
                <Text style={{ marginTop: 10, color: colors.primary800 }}>Đang tải thông tin...</Text>
            </SafeAreaView>
        );
    }
    return (
        // <SafeAreaView style={{
        //     flex: 1,
        // }}>
        <SafeAreaView style={styles.container}>
            <View style={{
                flex: 1,
                paddingTop: spacing.lg * 1.25,
                paddingHorizontal: spacing.md,
            }}>
                {/* <View style={styles.container}> */}
                {/* <LinearGradient
                    colors={['#0B3478', '#2877ED']}
                    locations={[0, 0.5]}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFillObject}
                /> */}
                <BackButton color={colors.primary800} />
                <Animated.View
                    style={styles.header}
                    entering={FadeInLeft.duration(500).springify()}
                >
                    <Text
                        style={{
                            fontSize: fontSizes['2xl'],
                            fontWeight: 700,
                            color: colors.primary800
                        }}>
                        Thông tin tài khoản
                    </Text>

                    <Pressable onPress={() => {
                        setIsEditing(!isEditing);
                    }}>
                        <Feather
                            name={isEditing ? "x" : "edit"}
                            size={28}
                            color={colors.primary800}
                        />
                    </Pressable>
                </Animated.View>
                <Animated.View
                    entering={FadeInDown.delay(100).duration(500).springify()}
                    style={styles.card}>
                    <View style={styles.avatarSection}>
                        <View>
                            {avatarUri ? (
                                <Image
                                    source={{ uri: avatarUri }}
                                    style={{ width: 150, height: 160, borderRadius: 75 }}
                                />
                            ) : (
                                <Avatar width={150} height={160} />
                            )}
                            {isEditing &&
                                <Animated.View
                                    style={styles.penButton}
                                    entering={FadeInDown.delay(100).duration(400).springify()}
                                >
                                    <Pressable
                                        onPress={pickImage}
                                    >
                                        <EditPen />
                                    </Pressable>
                                </Animated.View>}
                        </View>
                    </View>

                    <View style={styles.main}>
                        <View style={{
                            alignItems: 'flex-start',
                            gap: spacing.sm
                        }}>
                            <Text style={styles.label}>Tên</Text>

                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons
                                    name="account"
                                    size={20}
                                    color="black"
                                    style={styles.icon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder={isEditing ? "Nhập tên" : "Nguyen Van An"}
                                    placeholderTextColor="#999"
                                    keyboardType="default"
                                    editable={isEditing}
                                    value={name}
                                    onChangeText={(value) => setName(value)}
                                />
                            </View>
                            {errors.name && <Text style={{ color: 'red' }}>{errors.name}</Text>}
                        </View>

                        <View style={{ alignItems: 'flex-start', gap: spacing.sm }}>
                            <Text style={styles.label}>Số điện thoại</Text>

                            <View style={styles.inputWrapper}>
                                <Feather name="phone" size={20} color="black" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder={isEditing ? "Nhập số điện thoại" : "0869255375"}
                                    placeholderTextColor="#999"
                                    keyboardType="number-pad"
                                    editable={isEditing}
                                    value={phoneNumber}
                                    onChangeText={(value) => setPhoneNumber(value)}
                                />
                            </View>
                            {errors.phoneNumber && <Text style={{ color: 'red' }}>{errors.phoneNumber}</Text>}
                        </View>
                    </View>
                    <View style={{ height: 80, marginTop: spacing.md }}>
                        {isEditing && (
                            <Animated.View
                                entering={FadeInDown.delay(100).duration(400).springify()}
                                exiting={FadeOutDown.duration(400).springify()}
                                style={styles.actionRow}
                            >
                                <AnimatedButton
                                    style={[styles.actionBtn, styles.cancelBtn]}
                                    onPress={() => setIsEditing(false)}
                                >
                                    <Text style={styles.cancelText}>Hủy</Text>
                                </AnimatedButton>

                                <AnimatedButton
                                    style={[styles.actionBtn, styles.saveBtn]}
                                    onPress={handleSave}
                                >
                                    <Text style={styles.saveText}>Lưu</Text>
                                </AnimatedButton>
                            </Animated.View>
                        )}
                    </View>
                </Animated.View>
            </View>

            <ResultModal
                visible={resultModalVisible}
                onClose={() => setResultModalVisible(prev => !prev)}
                state={'save'}
            />

            <ErrorModal
                visible={errorModalVisible}
                onClose={() => setErrorModalVisible(prev => !prev)}
                message={"Cập nhật thông tin người dùng thất bại"} />
            <View>
                <NavBar />
            </View>
        </SafeAreaView >
    );
};

export default Account;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray100,
        // paddingTop: spacing.lg * 1.25,
        // paddingHorizontal: spacing.md,

        // marginBottom: spacing.lg * 4
    },
    header: {
        alignSelf: 'stretch',
        marginBottom: spacing.md,
        marginTop: spacing.md,
        justifyContent: 'space-between',
        gap: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatarSection: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    main: {
        // flex: 3,
        marginTop: spacing.lg,
        gap: spacing.lg,
    },
    label: {
        fontSize: fontSizes.md,
        fontWeight: "600",
        color: colors.primary800,
        marginBottom: 6,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#000",
    },
    penButton: {
        position: "absolute",
        bottom: 0,
        right: 10,
        backgroundColor: "#F97316",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    card: {
        // flex: 1,
        marginTop: spacing.lg,
        paddingTop: spacing.lg,
        paddingHorizontal: spacing.lg,
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.gray200,

        // Shadow (iOS)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,

        // Elevation (Android)
        elevation: 3,
    },
    readonlyInput: {
        backgroundColor: colors.gray100,
        color: colors.gray500,
    },
    actionRow: {
        paddingHorizontal: spacing.lg,
        // position: "absolute",
        // bottom: 20,
        // left: 0,
        // right: 0,
        gap: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        // padding: 10,
        backgroundColor: "white",
        zIndex: 10,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },

    cancelBtn: {
        backgroundColor: colors.gray200,
    },

    saveBtn: {
        backgroundColor: colors.primary500,
    },

    cancelText: {
        color: colors.primary800,
        fontWeight: "600",
        fontSize: fontSizes.md,
    },

    saveText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: fontSizes.md,
    },
});