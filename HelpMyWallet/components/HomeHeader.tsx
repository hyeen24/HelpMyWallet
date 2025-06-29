import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '@/constants/Colors'
import { AuthContext } from '@/contexts/AuthContext'
import * as SecureStore from 'expo-secure-store';
import { toTitleCase } from '@/utils/stringUtils'
import { darkTheme, lightTheme } from '@/constants/Theme'

const HomeHeader = () => {
    const { logout } = useContext(AuthContext);
    const name = SecureStore.getItem("name") || "";
    const appTheme = useColorScheme();
    const Theme = appTheme === 'dark' ? darkTheme: lightTheme

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Theme.cardColors}]}>
        <View style={styles.leftContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>     
                <Image
                    source={require('../assets/images/react-logo.png')}
                    style={{ height: 50, width: 50, borderRadius: 30 }}
                />
                <View style={{ marginLeft: 10}}>
                    <Text style={{ color: Colors.white,  fontSize: 12}}>Hi, {toTitleCase(name)}</Text>
                    <Text style={{ color: Colors.white, fontSize: 16}}>Your Budget</Text>
                </View>
            </View >
            <TouchableOpacity onPress={logout} style={{ 
                borderColor: '#666',
                borderWidth:1,
                padding: 8,
                borderRadius:10,
                }}>
                <Text style={{ color: Colors.white, fontSize: 12}}>Logout</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default HomeHeader

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingBottom: 30
    },
    leftContainer : {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        height: 70, 
        alignItems: 'center', 
        paddingHorizontal: 20
    }
})