import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '@/constants/Colors'

const Header = () => {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.leftContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>     
                <Image
                    source={require('../assets/images/react-logo.png')}
                    style={{ height: 50, width: 50, borderRadius: 30 }}
                />
                <View style={{ marginLeft: 10}}>
                    <Text style={{ color: Colors.white, fontSize: 12}}>Hi, User</Text>
                    <Text style={{ color: Colors.white, fontSize: 16}}>Your Budget</Text>
                </View>
            </View >
            <TouchableOpacity onPress={() => {}} style={{ 
                borderColor: '#666',
                borderWidth:1,
                padding: 8,
                borderRadius:10,
                }}>
                <Text style={{ color: Colors.white, fontSize: 12}}>My Transactions</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flex:1, 
        backgroundColor:Colors.black
    },
    leftContainer : {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        height: 70, 
        alignItems: 'center', 
        paddingHorizontal: 20
    }
})