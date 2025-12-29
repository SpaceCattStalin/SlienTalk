import { colors, fontSizes, spacing } from '@/global/theme';
import { ChevronRight } from 'lucide-react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Logout from '@/assets/images/logout.svg';
import Profile from '@/assets/images/profile.svg';
import Wallet from '@/assets/images/wallet.svg';
import { ExternalLink, LogIn } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthProvider';

import LogoutModal from '@/components/LogoutModal';
import NavBar from '@/components/NavBar';
import AnimatedButton from '@/components/animation/AnimatedButton';
import EndingMessageOverlay from '@/components/walkthrough/EndingMessageOverlay';
import ProfileScreenOverlay from '@/components/walkthrough/ProfileScreenOverlay';
import ProfileScreen2Overlay from '@/components/walkthrough/ProfileScreenOverlay2';
import ProfileScreen3Overlay from '@/components/walkthrough/ProfileScreenOverlay3';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import { router } from 'expo-router';
import { useWalkthroughStep } from 'react-native-interactive-walkthrough';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';

const Index = () => {
  const [logoutVisible, setLogoutVisible] = useState(false);

  const { authState, signIn } = useContext(AuthContext);

  // const [fontsLoaded] = useFonts({
  //   ...Ionicons.font,
  //   ...FontAwesome5.font,
  // });


  // if (!fontsLoaded) {
  //   return (
  //     <View style={styles.loader}>
  //       <ActivityIndicator size="large" color="#007AFF" />
  //     </View>
  //   );
  // }

  if (!authState.userToken) {
    return (
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: "#fff"
      }}>
        <View style={{ flex: 1 }}>
          <View style={{
            paddingHorizontal: spacing.md,
            flex: 1
          }}
          >
            <View style={{ marginTop: spacing.lg * 2, gap: spacing.md }}>
              <Text style={{
                fontSize: fontSizes.lg,
                fontWeight: 500,
                color: colors.primary700
              }}>
                Thông tin cá nhân
              </Text>
              <Animated.View
                entering={FadeInLeft.delay(300).duration(500).springify()}
              //onLayout={step22OnLayout}
              >
                <AnimatedButton
                  onPress={() => router.push('./login')}>
                  <View style={styles.optionWrapper}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                      <View style={{ ...styles.iconContainer, backgroundColor: '#E6F0FB' }}>
                        <LogIn size={20} color="#629BEE" />
                      </View>
                      <Text style={styles.optionTitle}>Đăng nhập</Text>
                    </View>
                    <View>
                      <ChevronRight />
                    </View>
                  </View>
                </AnimatedButton>
              </Animated.View>
            </View>

            <View style={{ marginTop: spacing.lg }}>
              <Animated.View
                entering={FadeInLeft.delay(250).duration(500).springify()}
              >

                <Text style={{
                  fontSize: fontSizes.lg,
                  fontWeight: 500,
                  color: colors.primary700
                }}>
                  Trợ giúp
                </Text>
              </Animated.View>

              <Animated.View
                entering={FadeInLeft.delay(300).duration(500).springify()}
              //onLayout={step23OnLayout}
              >
                <AnimatedButton>
                  <View style={{
                    ...styles.optionWrapper,
                    paddingVertical: spacing.md,
                    marginVertical: spacing.md
                  }}>
                    <Text style={{ ...styles.optionTitle, marginLeft: spacing.sm }}>Hướng dẫn sử dụng</Text>
                    <View>
                      <ChevronRight />
                    </View>
                  </View>
                </AnimatedButton>
              </Animated.View>


              <Animated.View
                entering={FadeInLeft.delay(300).duration(500).springify()}
              >
                <AnimatedButton>
                  <View style={{
                    ...styles.optionWrapper,
                    marginBottom: spacing.md,
                    paddingVertical: spacing.md, paddingRight: spacing.md
                  }}>
                    <Text style={{ ...styles.optionTitle, marginLeft: spacing.sm }}>Câu hỏi thường gặp</Text>
                    <View>
                      <ExternalLink size={20} color="#629BEE" />
                    </View>
                  </View>
                </AnimatedButton>
              </Animated.View>

              <Animated.View
                entering={FadeInLeft.delay(300).duration(500).springify()}
              >
                <AnimatedButton>
                  <View style={{
                    ...styles.optionWrapper,
                    marginBottom: spacing.md,
                    paddingVertical: spacing.md, paddingRight: spacing.md
                  }}>
                    <Text style={{ ...styles.optionTitle, marginLeft: spacing.sm }}>Điều khoản sử dụng</Text>
                    <View>
                      <ExternalLink size={20} color="#629BEE" />
                    </View>
                  </View>
                </AnimatedButton>
              </Animated.View>
            </View>

          </View>

          <View
            style={{
              flexDirection: "row",
              height: 6,
              width: "100%",
            }}
          >
            <View style={{ flex: 1, backgroundColor: "#10B981" }} />
            <View style={{ flex: 1, backgroundColor: "#F97316" }} />
            <View style={{ flex: 1, backgroundColor: "#6366F1" }} />
            <View style={{ flex: 1, backgroundColor: "#FACC15" }} />
            <View style={{ flex: 1, backgroundColor: "#3B82F6" }} />
          </View>

          <View
            style={{
              paddingHorizontal: spacing.md,
              backgroundColor: colors.gray400,
              alignSelf: 'auto',
              paddingBottom: spacing.lg * 4
            }}>
            <Animated.View
              entering={FadeInDown.delay(300).duration(500).springify()}
            >
              <Text style={{
                fontSize: fontSizes.lg,
                fontWeight: 500,
                marginTop: spacing.md,
                color: colors.gray700
              }}>
                Mạng xã hội của chúng tôi
              </Text>
            </Animated.View>

            <Animated.View
              // onLayout={step24OnLayout}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly'
              }}
              entering={FadeInDown.delay(500).duration(500).springify()}
            >
              <TouchableOpacity className='p-3 rounded-2xl border border-gray-300 flex justify-center items-center'>
                <Ionicons name="logo-google" size={28} color="#DB4437" />
              </TouchableOpacity>

              <TouchableOpacity className='p-3 rounded-2xl border border-gray-300 flex justify-center items-center'>
                <FontAwesome5 name="facebook" size={28} color="blue" />
              </TouchableOpacity>

              <TouchableOpacity className='p-3 rounded-2xl border border-gray-300 flex justify-center items-center'>
                <Image source={require('@/assets/images/zalo.png')}
                  className="w-8 h-8"
                  resizeMode="contain" />
              </TouchableOpacity>
            </Animated.View>
          </View>
          <NavBar />
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      {logoutVisible && (
        <View style={styles.overlay} pointerEvents="auto">
          {/* tapping outside should also close the modal */}
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setLogoutVisible(false)}
          />
        </View>
      )}
      <View className='flex-1'>
        {/* <View style={styles.profileContainer}>
          <Background
            style={StyleSheet.absoluteFillObject}
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          />
          <Animated.View
            style={{
              paddingTop: spacing.lg,
              paddingHorizontal: spacing.md,
            }}
            entering={FadeInLeft.duration(500).springify()}
          >
            <Text
              style={{
                fontSize: fontSizes['2xl'],
                fontWeight: 700,
                color: colors.gray50
              }}>
              Tài khoản
            </Text>
          </Animated.View>
          <Animated.View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            entering={FadeInDown.delay(100).duration(500).springify()}
          >
            <Avatar
              width={110}
              height={110}
            />
            <View
              style={{
                alignItems: 'center',
                gap: spacing.xs,
                marginTop: spacing.md
              }}>

            </View>
          </Animated.View>
        </View> */}
        <View style={styles.main}>
          <Animated.View
            entering={FadeInLeft.delay(200).duration(500).springify()}
          >
            <Text style={{
              color: colors.primary800,
              fontWeight: 600,
              fontSize: fontSizes.xl
            }}>
              Tổng quan tài khoản
            </Text>
          </Animated.View>

          <View style={styles.optionsContainer}>
            <Animated.View
              entering={FadeInLeft.delay(300).duration(500).springify()}
            >
              <AnimatedButton onPress={() => router.push('./account')}>
                <View style={styles.optionWrapper}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                    <View style={{ ...styles.iconContainer, backgroundColor: '#E6F0FB' }}>
                      <Profile
                        width={20}
                        height={20}
                        stroke={'#629BEE'}
                      />
                    </View>
                    <Text style={styles.optionTitle}>Thông tin tài khoản</Text>
                  </View>
                  <View>
                    <ChevronRight />
                  </View>
                </View>
              </AnimatedButton>
            </Animated.View>

            <Animated.View
              entering={FadeInLeft.delay(320).duration(500).springify()}
            >
              <AnimatedButton onPress={() => router.push('./planIntro')}>
                <View style={styles.optionWrapper}>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                    <View style={{ ...styles.iconContainer, backgroundColor: '#E6F0FB' }}>
                      <Wallet
                        width={20}
                        height={20}
                        stroke={'#629BEE'}
                      />
                    </View>
                    <Text style={styles.optionTitle}>Gói đăng kí</Text>
                  </View>
                  <View>
                    <ChevronRight />
                  </View>
                </View>
              </AnimatedButton>
            </Animated.View>


            {/* <AnimatedButton>
              <View style={styles.optionWrapper}>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <View style={{ ...styles.iconContainer, backgroundColor: '#E6F0FB' }}>
                    <Lock
                      width={20}
                      height={20}
                    />
                  </View>
                  <Text style={styles.optionTitle}>Đổi mật khẩu</Text>
                </View>

                <View>
                  <ChevronRight />
                </View>
              </View>
            </AnimatedButton> */}

            <Animated.View
              entering={FadeInLeft.delay(340).duration(500).springify()}
            >

              <AnimatedButton onPress={() => setLogoutVisible((prev) => !prev)}>
                <View style={styles.optionWrapper}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                    <View style={{ ...styles.iconContainer, backgroundColor: '#E6F0FB' }}>
                      <Logout
                        width={20}
                        height={20}
                      />
                    </View>
                    <Text style={styles.optionTitle}>Đăng xuất</Text>
                  </View>

                  <View>
                    <ChevronRight />
                  </View>
                </View>
              </AnimatedButton>
            </Animated.View>

            <View style={{ marginTop: spacing.sm }}>
              <Animated.View
                entering={FadeInLeft.delay(250).duration(500).springify()}
              >

                <Text style={{
                  fontSize: fontSizes.lg,
                  fontWeight: 500,
                  color: colors.primary700
                }}>
                  Trợ giúp
                </Text>
              </Animated.View>

              <Animated.View
                entering={FadeInLeft.delay(300).duration(500).springify()}
              >
                <AnimatedButton>
                  <View style={{
                    ...styles.optionWrapper,
                    paddingVertical: spacing.md,
                    marginVertical: spacing.md
                  }}>
                    <Text style={{ ...styles.optionTitle, marginLeft: spacing.sm }}>Hướng dẫn sử dụng</Text>
                    <View>
                      <ChevronRight />
                    </View>
                  </View>
                </AnimatedButton>
              </Animated.View>


              <Animated.View
                entering={FadeInLeft.delay(300).duration(500).springify()}
              >
                <AnimatedButton>
                  <View style={{
                    ...styles.optionWrapper,
                    marginBottom: spacing.md,
                    paddingVertical: spacing.md, paddingRight: spacing.md
                  }}>
                    <Text style={{ ...styles.optionTitle, marginLeft: spacing.sm }}>Câu hỏi thường gặp</Text>
                    <View>
                      <ExternalLink size={20} color="#629BEE" />
                    </View>
                  </View>
                </AnimatedButton>
              </Animated.View>

              <Animated.View
                entering={FadeInLeft.delay(300).duration(500).springify()}
              >
                <AnimatedButton>
                  <View style={{
                    ...styles.optionWrapper,
                    marginBottom: spacing.md,
                    paddingVertical: spacing.md, paddingRight: spacing.md
                  }}>
                    <Text style={{ ...styles.optionTitle, marginLeft: spacing.sm }}>Điều khoản sử dụng</Text>
                    <View>
                      <ExternalLink size={20} color="#629BEE" />
                    </View>
                  </View>
                </AnimatedButton>
              </Animated.View>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            height: 6,
            width: "100%",
          }}
        >
          <View style={{ flex: 1, backgroundColor: "#10B981" }} />
          <View style={{ flex: 1, backgroundColor: "#F97316" }} />
          <View style={{ flex: 1, backgroundColor: "#6366F1" }} />
          <View style={{ flex: 1, backgroundColor: "#FACC15" }} />
          <View style={{ flex: 1, backgroundColor: "#3B82F6" }} />
        </View>

        <View style={{
          paddingHorizontal: spacing.md,
          backgroundColor: colors.gray400,
          alignSelf: 'stretch',
          paddingBottom: spacing.lg ,
        }}>
          <Animated.View
            entering={FadeInDown.delay(300).duration(500).springify()}
          >
            <Text style={{
              fontSize: fontSizes.lg,
              fontWeight: 500,
              marginTop: spacing.md,
              color: colors.gray700
            }}>
              Mạng xã hội của chúng tôi
            </Text>
          </Animated.View>

          <Animated.View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly'
            }}
            entering={FadeInDown.delay(500).duration(500).springify()}
          >
            <TouchableOpacity className='p-3 rounded-2xl border border-gray-300 flex justify-center items-center'>
              <Ionicons name="logo-google" size={28} color="#DB4437" />
            </TouchableOpacity>

            <TouchableOpacity className='p-3 rounded-2xl border border-gray-300 flex justify-center items-center'>
              <FontAwesome5 name="facebook" size={28} color="blue" />
            </TouchableOpacity>

            <TouchableOpacity className='p-3 rounded-2xl border border-gray-300 flex justify-center items-center'>
              <Image source={require('@/assets/images/zalo.png')}
                className="w-8 h-8"
                resizeMode="contain" />
            </TouchableOpacity>
          </Animated.View>

        </View>
        <LogoutModal isVisible={logoutVisible} onCancel={() => setLogoutVisible((prev) => !prev)} />
        <NavBar />
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  profileContainer: {
    flex: 1.5,
  },
  main: {
    //flex: 4,
    //borderRadius: 40,
    backgroundColor: colors.gray50,
    paddingTop: spacing.lg * 1.25,
    paddingHorizontal: spacing.md,
    gap: spacing.lg
  },
  optionsContainer: {
    gap: spacing.md
  },
  iconContainer: {
    padding: spacing.md,

    borderRadius: 10,
  },
  optionWrapper: {
    borderRadius: 10,
    padding: spacing.sm,
    borderWidth: .5,
    borderColor: colors.primary300,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  optionTitle: {
    fontSize: fontSizes.lg,
    color: colors.primary800,
    fontWeight: '500',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // or your theme background
  },
});