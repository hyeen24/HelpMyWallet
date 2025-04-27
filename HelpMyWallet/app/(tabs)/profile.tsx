import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { Stack } from 'expo-router'

const profile = () => {
  return (
    <>
        <Stack.Screen options={{ headerShown: false}}/>
          <View style={styles.container}>
            <Text style={styles.text}>profile</Text>
            </View>
    </>
  )
}

export default profile

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