import { PressableProps, TextInputProps, TextProps, ViewProps } from "react-native";

export type ThemedTextProps = TextProps;

export interface ThemedViewProps extends ViewProps {
    safe?: boolean;
    transparent?: boolean;
}

export interface ThemedButtonProps extends PressableProps {
    title: string;
}

export type ThemedTextInputProps = TextInputProps;