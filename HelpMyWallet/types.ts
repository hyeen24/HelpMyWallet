import { TextInput, TextInputProps, TextStyle, TouchableOpacityProps, ViewStyle } from "react-native";


export interface ExpenseType {
    id: string;
    name: string;
    amount : string;
}

export interface IncomeType {
    id: string;
    name: string;
    amount: string;
}

export interface SpendingType {
    id : number;
    name : string;
    date : string;
    amount : string;
}

export interface InputProps extends TextInputProps {
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    inputRef?: React.RefObject<TextInput>;
    // label?: string;
    // error?: string;
  }

export interface CustomButtonProps extends TouchableOpacityProps {
    style?: ViewStyle;
    onPress?: () => void;
    loading?: boolean;
    hasShadow?: boolean;
    children: React.ReactNode;
  }

export type ScreenWrapperProps = {
    style?: ViewStyle;
    children: React.ReactNode;
  };