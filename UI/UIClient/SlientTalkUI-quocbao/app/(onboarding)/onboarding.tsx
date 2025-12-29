import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import OnboardingScreen from '@/components/OnboardingScreen';
import { colors } from '@/global/theme';
import { OnboardingPage } from '../../components/OnboardingScreen';
import LottieView from 'lottie-react-native';
import { useRoute } from '@react-navigation/native';
const onboardingPages: OnboardingPage[] = [
  {
    title: 'Phiên dịch trực tiếp',
    image:
      <View>
        <LottieView
          source={require('@/assets/lottie/conversation.json')}
          autoPlay
          style={{ width: 400, height: 400 }}
        />
      </View>, subtitle: 'Giao tiếp linh hoạt mọi lúc mọi nơi. Dù bạn ra dấu hay nói, Silent Talk đều hiểu.',
    backgroundColor: colors.primary50
  },
  {
    title: 'Công cụ học tập tương tác',
    image:
      <View>
        <LottieView
          source={require('@/assets/lottie/chatbot.json')}
          autoPlay
          style={{ width: 300, height: 300 }}
        />
      </View>,
    subtitle: 'Chỉ cần gõ hoặc ra dấu, bạn sẽ biết được nghĩa, cách dùng và cả cách ra dấu chính xác.',
    backgroundColor: colors.primary50
  },
  {
    title: 'Từ điển ngôn ngữ ký hiệu',
    image:
      <View>
        <LottieView
          source={require('@/assets/lottie/student.json')}
          autoPlay
          style={{ width: 300, height: 300 }}
        />
      </View>, subtitle: 'Dễ dàng tra cứu và học Ngôn ngữ Ký hiệu Việt Nam với hình ảnh và avatar 3D sinh động.',
    backgroundColor: colors.primary50
  },
];

type OnboardingProps = {
  onDone: () => void;
};

const Index = ({ onDone }: OnboardingProps) => {

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <OnboardingScreen
          pages={onboardingPages}
          onDone={onDone}
        />
      </View>
    </View >
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