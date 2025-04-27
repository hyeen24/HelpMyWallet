import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AntDesign, FontAwesome, SimpleLineIcons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'

const Page = () => {
  return (
    <View>
      <Text>Page</Text>
      <SimpleLineIcons name='pie-chart' size={18} color={Colors.black}/>
      <FontAwesome name="user-o" size={18} color={Colors.black}/>
      <AntDesign name="swap" size={18} color={Colors.black}/>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black
    }
})