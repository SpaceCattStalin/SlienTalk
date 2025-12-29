import ThemedView from '@/components/ThemedView';
import React, { useContext, useState } from 'react';
import { Image, Text, TouchableOpacity, TextInput, View, StyleSheet, Alert } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import SunAnimation from '@/components/animation/SunAnimation';
import ThemedText from '@/components/ThemedText';
import { Link, router } from 'expo-router';
import Animated, { FadeInLeft, FadeInUp } from 'react-native-reanimated';
import { colors } from '@/global/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { register } from '@/services/api';
import { AuthContext } from '@/context/AuthProvider';
import { setUserLimit } from '@/services/userLimit';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState('');

  const { signUp } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (password !== confirm) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      const result = await register(email, password);
      console.log('Register success:', result);

      if (result?.isSuccess) {
        await setUserLimit();

        router.push({
          pathname: '/login',
          params: { fromRegister: 'true' },
        });
      } else {
        Alert.alert('Đăng ký thất bại', 'Không nhận được token từ server.');
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Đăng ký thất bại', 'Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='relative h-full' style={styles.container}>
      <Animated.View entering={FadeInLeft.delay(200).duration(500).springify()}>
        <SunAnimation size={350} />
      </Animated.View>
      <Image source={require('@/assets/images/login_bg.png')} className='h-full w-full absolute bottom-10' />

      <ThemedView className='flex h-full w-full justify-around' transparent={true}>
        <View className='flex flex-auto justify-end items-center' transparent={true}>
          <Animated.Text entering={FadeInUp.duration(500).springify()}
            className='font-semibold text-5xl h-20 text-white absolute bottom-32 p-2'>
            Đăng ký
          </Animated.Text>
        </View>

        <ThemedView className='flex-1 flex items-center pt-0 mx-4 gap-4' transparent={true}>
          <Animated.View entering={FadeInUp.delay(200).duration(500).springify()} className='bg-gray-200 p-1.5 rounded-2xl w-full border-solid'>
            <TextInput
              placeholder='Email'
              className='text-lg text-black'
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
            />
          </Animated.View>

          {/* <View className='flex flex-row gap-3 mb-5'> */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(500).springify()}
            className='bg-gray-200 p-1.5 rounded-2xl w-full'>
            <TextInput
              placeholder='Mật khẩu'
              className='text-lg text-black'
              secureTextEntry
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300).duration(500).springify()}
            className='bg-gray-200 p-1.5 rounded-2xl w-full'>
            <TextInput
              placeholder='Xác nhận mật khẩu'
              className='text-lg text-black'
              secureTextEntry
              placeholderTextColor="#666"
              value={confirm}
              onChangeText={setConfirm}
            />
          </Animated.View>
          {/* </View> */}


          <Animated.View entering={FadeInUp.delay(200).duration(500).springify()} className='w-full'>
            <TouchableOpacity
              className='w-full bg-brand-400 p-3 rounded-2xl'
              onPress={handleRegister}
              disabled={loading}
            >
              <Text
                className='text-xl font-bold text-white text-center'
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </Text>
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
            <ThemedText>Đã có tài khoản? </ThemedText>
            <TouchableOpacity>
              <Link href="./login">
                <ThemedText className='text-sky-600'>
                  Đăng nhập
                </ThemedText>
              </Link>
            </TouchableOpacity>
          </Animated.View>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary500,
  }
});