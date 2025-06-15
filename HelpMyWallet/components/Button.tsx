import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { CustomButtonProps } from '@/types'
import { TouchableOpacity } from 'react-native'
import Colors from '@/constants/Colors'
import Loading from './Loading'

const Button = ({
    style,
    onPress,
    loading = false,
    children,
    disabled = false
 }: CustomButtonProps) => {
    if(loading) {
        return (
            <View style={[styles.button, style, {backgroundColor: 'transparent'}]}>
                <Loading/>
            </View>
        );
    }
  return (
    <TouchableOpacity style={[ disabled ? styles.disabledButton :styles.button, style]} onPress={onPress} disabled={disabled}>
        {children}
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.tintColor,
        borderRadius: 30,
        borderCurve: 'continuous',
        height: 52,
        justifyContent: 'center',
        alignItems: 'center'
    },
    disabledButton: {
        backgroundColor: Colors.neutral800,
        borderRadius: 30,
        borderCurve: 'continuous',
        height: 52,
        justifyContent: 'center',
        alignItems: 'center'
    }
});