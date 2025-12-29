import { AuthAction, AuthContextType, AuthState } from "@/types/AuthTypes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { createContext, ReactNode, useEffect, useMemo, useReducer } from "react";



const initialState: AuthState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "RESTORE_TOKEN":
            return {
                ...state,
                userToken: action.token,
                isLoading: false,
            };
        case "SIGN_IN":
            return {
                ...state,
                userToken: action.token,
                isSignout: false,
            };
        case "SIGN_OUT":
            return {
                ...state,
                userToken: null,
                isSignout: true,
            };
        default:
            return state;
    }
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode; }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                dispatch({ type: 'RESTORE_TOKEN', token });
            } catch (e) {
                console.error("Không thể lấy token:", e);
            }
        };
        bootstrapAsync();
    }, []);

    const authContext: AuthContextType = useMemo(() => (
        {
            signIn: async (token: string) => {
                try {
                    await AsyncStorage.setItem('userToken', token);
                    dispatch({ type: "SIGN_IN", token });
                } catch (e) {
                    console.error("Lưu token thất bại:", e);
                }
            },

            signOut: async () => {
                try {
                    await AsyncStorage.removeItem('userToken');
                    dispatch({ type: "SIGN_OUT" });
                } catch (e) {
                    console.error("Xóa token thất bại:", e);
                }
            },
            /* signIn: async (data: any) => {
                dispatch({ type: "SIGN_IN", token: "ada" });
            },
            signOut: async () => {
                dispatch({ type: "SIGN_OUT" });
            }, */
            signUp: async (data: any) => {
                dispatch({ type: "SIGN_UP" });
            },
            restoreToken: () => {
                return state.userToken;
            },
            authState: state
        }
    ), [state]);

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
};
