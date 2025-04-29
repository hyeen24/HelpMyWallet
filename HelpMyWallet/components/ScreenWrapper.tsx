import { View, Text, Dimensions, Platform, StatusBar } from 'react-native'
import React from 'react'
import { ScreenWrapperProps } from '@/types'
import Colors from '@/constants/Colors';

const {height} = Dimensions.get('window');

const ScreenWrapper = ({style, children}: ScreenWrapperProps) => {
    let paddingTop = Platform.OS == 'ios' ? height * 0.06 : 50;
  return (
    <View style={[{
        paddingTop,
        flex: 1,
        backgroundColor: Colors.black
        }, 
        style,
        ]}>
            <StatusBar barStyle="light-content"/>
            {children}
    </View>
  )
}

export default ScreenWrapper