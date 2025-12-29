import AsyncStorage from '@react-native-async-storage/async-storage';

const FREE_LIMIT = 10;

export const setUserLimit = async (limit: number = FREE_LIMIT) => {
    try {
        await AsyncStorage.setItem('user_limit', limit.toString());
    } catch (err) {
        console.log("Lỗi khi lưu user limit:", err);
    }
};

export const getUserLimit = async (): Promise<number> => {
    try {
        const value = await AsyncStorage.getItem('user_limit');
        return value ? parseInt(value, 10) : FREE_LIMIT;
    } catch (err) {
        console.log("Lỗi khi lấy user limit:", err);
        return FREE_LIMIT;
    }
};
