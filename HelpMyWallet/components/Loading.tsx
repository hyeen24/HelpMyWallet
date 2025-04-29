import { View, Text, ActivityIndicatorProps, ActivityIndicator } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'

const Loading = ({
    size = "large",
    color = Colors.tintColor
}: ActivityIndicatorProps) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={size} color={color}/>
    </View>
  )
}

export default Loading