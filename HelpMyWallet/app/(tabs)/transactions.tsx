import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Colors from '@/constants/Colors'

const transactions = () => {
  return (
      <>
          <Stack.Screen options={{ headerShown: false}}/>
            <View style={styles.container}>
              <Text style={styles.text}>transactions</Text>
              </View>
      </>
    )
}

export default transactions

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