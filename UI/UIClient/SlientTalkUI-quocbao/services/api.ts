import { CreatePaymentRequest, DeleteCollectionResponse, MoveSignWordRequest, MoveSignWordResponse, PaymentCallback, RelatedWord, SignWord, WordByIdResponse } from "@/types/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

//const BASE_URL = 'http://192.168.1.199:5042';

//const BASE_URL = 'http://192.168.1.153:5042';

//const BASE_URL = 'https://curious-pauline-catchable.ngrok-free.dev';
const BASE_URL = 'https://api20251116200831-djh7b7e4dseec6a4.southeastasia-01.azurewebsites.net';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


const _get = (url: string, config = {}) => {
    return apiClient.get(url, config);
};

const _delete = (url: string, config = {}) => {
    return apiClient.delete(url, config);
};

const _put = (url: string, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
};

const _post = (url: string, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
};


const register = async (email: string, password: string) => {
    try {
        console.log(`${BASE_URL}/api/auth/register`);
        const response = await axios.post(`${BASE_URL}/api/auth/register`, { email, password });
        return response.data;
    } catch (error) {
        console.log(`${BASE_URL}/api/auth/register`);

        console.error(error);
        throw error;
    }
};

const getWordsByCategory = async (token: string, category?: string) => {
    try {
        const response = await _get(`/api/signwordcollections/by_category`, {
            params: { category },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching words by category:', error.response?.data || error.message);
        throw error;
    }
};
const getWordById = async (token: string, id: string): Promise<WordByIdResponse> => {
    try {
        const response = await _get(`/api/signwordcollections/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching word by ID:', error.response?.data || error.message);
        throw error;
    }
};

const getRelatedWords = async (signWordId: string): Promise<RelatedWord[]> => {
    try {
        const response = await _get(`/api/signwordcollections/${signWordId}/related`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching related words:', error.response?.data || error.message);
        throw error;
    }
};

export const createCollection = async (
    token: string,
    request: { name: string; isDefault: boolean; }
) => {
    try {
        const response = await _post("/api/signwordcollections", request, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        //console.error("Error creating collection:", error.response?.data || error.message);
        throw error;
    }
};

export const addWordToCollection = async (
    token: string,
    request: { collectionId: string; signWordId: string; }
) => {
    try {
        const response = await _post("/api/signwordcollections/add_word", request, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error adding word to collection:", error.response?.data || error.message);
        throw error;
    }
};

export const getMyCollections = async (token: string) => {
    try {
        const response = await _get("/api/signwordcollections/mine", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        console.error("Error fetching user collections:", error.response?.data || error.message);
        throw error;
    }
};

export const getAll = async (token: string) => {
    try {
        const response = await _get("/api/signwordcollections/all_words", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        console.error("Error fetching user collections:", error.response?.data || error.message);
        throw error;
    }
};

export const removeWordFromCollections = async (
    token: string,
    request: {
        collectionId: string,
        signWordId: string;
    }
) => {
    try {
        const response = await _post("/api/signwordcollections/remove_word_from_all_collections", request, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error: any) {
        console.log("Error removing sign word", error);
        throw error;
    }
};

export const getWordsInCollection = async (collectionId: string) => {
    try {
        const token = await AsyncStorage.getItem("userToken");

        const res = await _get("/api/signwordcollections/get_by_collection",
            {
                params: { collectionId: collectionId },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return res.data;
    } catch (err: any) {
        console.log("Error getting words in collection", err);
        throw err;
    }
};

// export const removeWordFromCollection = async (signWordId: string, collectionId: string) => {
//     try {
//         const res = await _post("/api/signwordcollections/remove_word_from_a_collection", {
//             params: {
//                 signWordId: signWordId,
//                 collectionId: collectionId
//             }
//         });

//         return res.data;
//     } catch (err: any) {
//         console.log("Error remove word from collection", err);
//         throw err;
//     }
// };

export const getUserInfo = async () => {
    try {
        const token = await AsyncStorage.getItem("userToken");
        const res = await _get("/api/user/get-by-id", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (err: any) {
        console.log("Lỗi khi lấy thông tin user!");
        throw err;
    }
};
export const updateUserInfo = async (name: string, phoneNumber: string) => {
    try {
        const token = await AsyncStorage.getItem("userToken");
        const res = await _put("/api/user/update-profile",
            { name, phoneNumber },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    } catch (err: any) {
        console.log("Lỗi khi cập nhật thông tin user!");
        throw err;
    }
};

export const uploadProfileImage = async (fileUri: string) => {
    try {
        const token = await AsyncStorage.getItem("userToken");

        const formData = new FormData();
        formData.append("formFile", {
            uri: fileUri,
            name: "profile.jpg",
            type: "image/jpeg",
        } as any);

        const res = await axios.post(`${BASE_URL}/api/user/profile-image`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data;
    } catch (err: any) {
        console.log("Lỗi khi upload ảnh user!");
        throw err;
    }
};


export const createPayment = async ({ userId, amount, itemName, description }: CreatePaymentRequest) => {
    try {
        const token = await AsyncStorage.getItem("userToken");

        const res = await _post("/api/payment/zalo/create",
            {
                userId: userId,
                amount: amount,
                itemName: itemName,
                description: description
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        return res.data;
    } catch (err: any) {
        console.log("Lỗi khi tạo đơn hàng thanh toán!");
        throw err;
    }
};

export const paymentCallback = async (data: PaymentCallback) => {
    try {
        const res = await _post("/api/payment/zalo/callback", data);

        return res;
    } catch (err: any) {
        console.log("Lỗi callback");
    }
};

export const checkStatus = async (appTransId: string) => {
    try {
        const res = await _get(`/api/payment/status/${appTransId}`);

        return res;
    } catch (err: any) {
        console.log(err);
    }
};

export const getCurrentPlan = async () => {
    try {
        const token = await AsyncStorage.getItem("userToken");

        const res = await _get("/api/payment/current",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        return res.data;
    } catch (err: any) {
        //console.log("Lỗi khi lấy plan!");
        throw err;
    }
};

export const moveWordBetweenCollections = async (
    token: string,
    request: MoveSignWordRequest
): Promise<MoveSignWordResponse> => {
    try {
        const response = await _post("/api/signwordcollections/move_word", request, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error moving word between collections:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteCollection = async (
    token: string,
    collectionId: string
): Promise<DeleteCollectionResponse> => {
    try {
        const response = await _delete(`/api/signwordcollections/${collectionId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error deleting collection:", error.response?.data || error.message);
        throw error;
    }
};

export const getWordOfTheDay = async () => {
    try {
        const token = await AsyncStorage.getItem("userToken");

        const res = await _get("/api/signwordcollections/word_of_the_day", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data;
    } catch (err: any) {
        console.error("Lỗi khi lấy từ của ngày hôm nay:", err.response?.data || err.message);
        throw err;
    }
};

export { register, getWordsByCategory, getWordById, getRelatedWords };
