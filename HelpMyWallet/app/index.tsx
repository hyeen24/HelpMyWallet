import { StyleSheet, View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import Colors from '@/constants/Colors';

const index = () => {
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
            router.push("/home");
            }, 2000);
    },[])
  return ( 
      <View style={styles.container}>
        <Image 
        style={styles.logo} resizeMode="contain" source={require('../assets/images/splashimage.pnh.png')}/>
      </View>
  )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.neutral900,
    },
    logo: {
        height: "20%",
        aspectRatio:1
    }
    
    });