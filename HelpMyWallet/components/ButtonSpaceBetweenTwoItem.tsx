import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import React from 'react'
import { ButtonSpaceBetweenTwoItemProps } from '@/types'
import Colors from '@/constants/Colors'

const ButtonSpaceBetweenTwoItem = ({
    leftIcon,
    rightIcon,
    leftTxt,
    rightTxt,
    onPress
} : ButtonSpaceBetweenTwoItemProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.pairContaienr}>
            {leftIcon}
            <Text style={{ fontSize: 16 ,fontWeight: 400}}>{leftTxt}</Text>
        </View>
        <View style={styles.pairContaienr}>
            <Text style={{ fontSize: 16 }}>{rightTxt}</Text>
            {rightIcon ? rightIcon : <View style={{paddingRight: 10}}></View>}
        </View>
    </TouchableOpacity>
  )
}

export default ButtonSpaceBetweenTwoItem

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        alignItems: 'center',
        borderRadius: 10,
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,     
        width: '90%'
    },
    pairContaienr: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginHorizontal: 10,
        paddingLeft: 10
    }
})