import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { BackButtonProps } from '@/types'
import { useRouter } from 'expo-router'
import Colors from '@/constants/Colors'
import { AntDesign } from '@expo/vector-icons'

const BackButton = ({
    style,
    iconSize = 26,

}: BackButtonProps) => {
    const router = useRouter();
  return (
    <TouchableOpacity onPress={()=> router.back()} style={[styles.button, style]}>
        <AntDesign name='caretleft' size={iconSize}
        color={Colors.white}
        weight="bold"
        />
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.neutral600,
        alignSelf: 'flex-start',
        borderRadius: 25,
        borderCurve: "continuous",
        padding: 5
    }
});