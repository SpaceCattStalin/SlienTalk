export interface AuthState {
    isLoading: boolean;
    isSignout: boolean;
    userToken: string | null;
}

export interface AuthContextType {
    signIn: (data: any) => Promise<void>;
    signOut: () => Promise<void>;
    signUp: (data: any) => Promise<void>;
    restoreToken: () => string | null;
    authState: AuthState;
}

export type AuthAction =
    | { type: "RESTORE_TOKEN"; token: string | null; }
    | { type: "SIGN_IN"; token: string | null; }
    | { type: "SIGN_UP"; }
    | { type: "SIGN_OUT"; }; 