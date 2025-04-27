import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AntDesign, FontAwesome, SimpleLineIcons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { Stack } from 'expo-router'
import Header from '@/components/Header'

const Page = () => {
  return (
    <>
    <Stack.Screen options={{
        header: () => <Header/>
    }}/>
        <View style={styles.container}>
        <Text>Page</Text>
        </View>
    </>
  )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.black,
        paddingHorizontal: 20
    },
    text: {
        color: Colors.white

    }
})