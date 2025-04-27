import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Colors from '@/constants/Colors'
import { AntDesign, FontAwesome, SimpleLineIcons } from '@expo/vector-icons'

const Layout = () => {
  return (
    <Tabs screenOptions={{
        tabBarStyle: {
            justifyContent: 'center',
            backgroundColor: Colors.grey,
            position: 'absolute',
            bottom: 40,
            height: 'auto',
            marginHorizontal: 120,
            paddingHorizontal: 10,
            paddingBottom:4,
            paddingTop: 4,
            borderRadius: 40
        },
        tabBarShowLabel: false,
        tabBarInactiveTintColor: '#999',
        tabBarActiveTintColor: Colors.white
    }}>
        <Tabs.Screen name='index' options={{ 
            tabBarIcon: ({color, focused}) => (
                <View style={{
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: 32,
                    width: 32,
                    borderRadius: 30,
                    backgroundColor: focused ? Colors.tintColor : Colors.grey
                }}>
                    <SimpleLineIcons name='pie-chart' size={18} color={color}/>
                </View>
            )
         }} />
         <Tabs.Screen name='transactions' options={{ 
            tabBarIcon: ({color, focused}) => (
                <View style={{
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: 32,
                    width: 32,
                    borderRadius: 30,
                    backgroundColor: focused ? Colors.tintColor : Colors.grey
                }}>
                    <AntDesign name="swap" size={18} color={color}/>
                </View>
            )
         }} />
         <Tabs.Screen name='profile' options={{ 
            tabBarIcon: ({color, focused}) => (
                <View style={{
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: 32,
                    width: 32,
                    borderRadius: 30,
                    backgroundColor: focused ? Colors.tintColor : Colors.grey
                }}>
                    <FontAwesome name="user-o" size={18} color={color}/>
                </View>
            )
         }} />
    </Tabs>
  )
}

export default Layout