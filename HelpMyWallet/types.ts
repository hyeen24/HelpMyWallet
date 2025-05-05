import { ReactNode } from "react";
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

export interface TransactionType {
    id : number;
    name : string;
    date : string;
    amount : string;
}

export interface DropDownItem {
  label: string;
  value: string | number;
}

export interface InputProps extends TextInputProps {
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    inputRef?: React.RefObject<TextInput>;
    // label?: string;
    // error?: string;
  }

  export type OptionItem = {
    value: string;
    label: string;
  };
  
  export interface DropDownProps {
    data: OptionItem[];
    onChange: (item: OptionItem) => void;
    placeholder: string;
  }

export interface CustomButtonProps extends TouchableOpacityProps {
    style?: ViewStyle;
    onPress?: () => void;
    loading?: boolean;
    hasShadow?: boolean;
    children: React.ReactNode;
  }

  export interface CustomIconButtonProps extends TouchableOpacityProps {
    style?: ViewStyle;
    onPress?: () => void;
    icon?: React.ReactNode;
    loading?: boolean;
    hasShadow?: boolean;
    text?: string;
    focusable?: boolean;
    focused?: boolean;
  }

export type ScreenWrapperProps = {
    style?: ViewStyle;
    children: React.ReactNode;
  };

export type BackButtonProps = {
style?: ViewStyle;
iconSize?: number;
};

export type ChildrenProps = {
  children: ReactNode ;
}