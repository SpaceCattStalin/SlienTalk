import ThemedView from '@/components/ThemedView';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import SunAnimation from '@/components/animation/SunAnimation';
import ThemedText from '@/components/ThemedText';
import { colors } from '@/global/theme';
import { useRoute } from '@react-navigation/native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInLeft, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthContext } from '@/context/AuthProvider';
import { login } from '@/services/auth';
import { useContext } from 'react';
import ResultModal from '@/components/ResultModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key: string, value: string) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error("Lỗi khi lưu data", e);
    }
};

const Login = () => {
    const router = useRouter();
    const route = useRoute();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signIn } = useContext(AuthContext);
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [resultState, setResultState] = useState<"register">("register");
    const { fromRegister } = useLocalSearchParams<{ fromRegister?: string; }>();

    React.useEffect(() => {
        if (fromRegister === "true") {
            setIsResultVisible(true);
            setResultState("register");
        }
    }, [fromRegister]);

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await login(email, password);
            console.log('Result', result);
            storeData("email", email);
            if (result?.accessToken) {
                await signIn(result.accessToken);
                router.push('/home');
            } else {
                setError(result?.message || 'Đăng nhập thất bại: Phản hồi không hợp lệ.');
                Alert.alert('Đăng nhập thất bại', `${error}}`);
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        // <ThemedView safe={true} className='relative h-full' style={styles.container}>
        <SafeAreaView className='relative h-full' style={styles.container}>
            <Animated.View entering={FadeInLeft.delay(200).duration(1000).springify()}>
                <SunAnimation size={350} />
            </Animated.View>
            {/* <CloudAnimation size={120}/> */}
            <Image source={require('@/assets/images/login_bg.png')} className='h-full w-full absolute bottom-10' />

            <View className='flex h-full w-full justify-around'>
                <View className='flex flex-auto justify-end items-center'>
                    <Animated.Text
                        entering={FadeInUp.duration(500).springify()}
                        className='font-semibold text-5xl h-20 text-white absolute bottom-36 p-2'>
                        Đăng nhập
                    </Animated.Text>
                </View>

                <ThemedView className='flex-1 flex items-center pt-0 mx-4 gap-4' transparent={true}>
                    <Animated.View entering={FadeInUp.duration(500).springify()} className='bg-gray-200 p-1.5 rounded-2xl w-full border-solid'>
                        <TextInput
                            placeholder='Email'
                            className='text-lg text-black'
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor="#666"
                        />
                    </Animated.View>
                    <Animated.View entering={FadeInUp.duration(500).springify()} className='bg-gray-200 p-1.5 rounded-2xl w-full mb-5'>
                        <TextInput
                            placeholder='Mật khẩu'
                            className='text-lg text-black'
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor="#666"
                        />
                    </Animated.View>
                    {error ? (
                        <Animated.Text
                            entering={FadeInUp.duration(300)}
                            className="text-red-500 text-base font-medium w-full text-center mb-2"
                        >
                            {error}
                        </Animated.Text>
                    ) : null}
                    <Animated.View entering={FadeInUp.delay(200).duration(500).springify()} className='w-full'>
                        <TouchableOpacity
                            className='w-full bg-brand-400 p-3 rounded-2xl bg-brand-500'
                            onPress={handleLogin}
                        >
                            <Text className='text-xl font-bold text-white text-center'>Đăng nhập</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(200).duration(500).springify()} className="w-full flex-row items-center my-2">
                        <View className="flex-1 h-[1px] bg-gray-300" />
                        <Text className="mx-3 text-gray-500">Hoặc</Text>
                        <View className="flex-1 h-[1px] bg-gray-300" />
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(200).duration(500).springify()} className='w-full flex flex-row justify-center gap-8'>
                        <TouchableOpacity className='p-3 rounded-2xl border border-gray-300 flex justify-center items-center'>
                            <Ionicons name="logo-google" size={22} color="#DB4437" />
                        </TouchableOpacity>

                        <TouchableOpacity className='p-3 rounded-2xl border border-gray-300 flex justify-center items-center'>
                            <FontAwesome5 name="facebook" size={24} color="blue" />
                        </TouchableOpacity>

                        <TouchableOpacity className='p-3 rounded-2xl border border-gray-300 flex justify-center items-center'>
                            <Image source={require('@/assets/images/zalo.png')}
                                className="w-8 h-8"
                                resizeMode="contain" />
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(200).duration(500).springify()} className='flex-row justify-center'>
                        <ThemedText>Bạn chưa có tài khoản? </ThemedText>
                        <TouchableOpacity>
                            <Link href="./signup">
                                <ThemedText className='text-sky-600'>
                                    Đăng ký
                                </ThemedText>
                            </Link>
                        </TouchableOpacity>
                    </Animated.View>
                </ThemedView>
            </View>

            <ResultModal
                visible={isResultVisible}
                onClose={() => setIsResultVisible(false)}
                state={resultState}
            />

        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary500,
    }
});