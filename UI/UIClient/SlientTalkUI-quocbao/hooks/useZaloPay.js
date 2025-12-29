import { NativeModules, NativeEventEmitter, Linking, Platform, Alert } from 'react-native';

const { PayZaloBridgeModule } = NativeModules;

const zaloPayEmitter = new NativeEventEmitter(PayZaloBridgeModule);

export const useZaloPay = () => {
  const subscribe = (callback) => {
    const subscription = zaloPayEmitter.addListener("EventPayZalo", callback);
    return () => subscription.remove();
  };

  const pay = async (zpToken, uriScheme) => {
    try {
      const result = await PayZaloBridgeModule.payOrder(zpToken, uriScheme);
      return result; // "success", "canceled"
    } catch (err) {
      throw err;
    }
  };

  return { pay, subscribe };
};
