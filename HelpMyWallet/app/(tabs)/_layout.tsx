import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Colors from '@/constants/Colors'
import { AntDesign, FontAwesome, SimpleLineIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import ProtectedRoute from '@/components/ProtectedRoute'

const Layout = () => {
  return (
    <>
   <ProtectedRoute>
    <Tabs screenOptions={{
            tabBarStyle: {
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: Colors.grey,
                position: 'absolute',
                bottom: 40,
                height: 56,
                marginHorizontal: 100,
                paddingHorizontal: 10,
                paddingBottom: 8,
                paddingTop: 8,
                borderRadius: 40,
                borderWidth: 1,
                borderTopWidth:1,
                borderColor: '#333',
                borderTopColor: '#333',
            },
            tabBarShowLabel: false,
            tabBarInactiveTintColor: '#999',
            tabBarActiveTintColor: Colors.white
        }}>
        <Tabs.Screen name='home' options={{ 
            tabBarIcon: ({color, focused}) => (
                <View style={{
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: 36,
                    width: 36,
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
                    height: 36,
                    width: 36,
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
                    height: 36,
                    width: 36,
                    borderRadius: 30,
                    backgroundColor: focused ? Colors.tintColor : Colors.grey
                }}>
                    <FontAwesome name="user-o" size={18} color={color}/>
                </View>
            )
         }} />
    </Tabs>
    </ProtectedRoute> 
    <StatusBar style="light"/>
   </>
  )
}

export default Layout