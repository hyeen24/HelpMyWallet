import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { BackButtonProps } from '@/types'
import { useRouter } from 'expo-router'
import Colors from '@/constants/Colors'
import { AntDesign } from '@expo/vector-icons'

const BackButton = ({
    style,
    iconSize = 22,

}: BackButtonProps) => {
    const router = useRouter();
    
  return (
    <TouchableOpacity onPress={()=> router.back()} style={[styles.button, style]}>
        <AntDesign name='left' size={iconSize}
        color={Colors.white}
        weight="bold"
        />
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'transparent',
        alignSelf: 'flex-start',
        borderRadius: 25,
        borderCurve: "continuous",
        padding: 5
    }
});