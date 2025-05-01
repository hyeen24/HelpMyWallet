import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Animated, { FadeIn } from 'react-native-reanimated';
import Button from '@/components/Button';

const welcome = () => {
    const router = useRouter();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginButton}>
                <Text style={{ color: Colors.white, fontWeight: 500 }}>Sign In</Text>
            </TouchableOpacity>

            <Animated.Image
            entering={FadeIn.duration(1000)}
            source={require('@/assets/images/welcome_background.webp')}
            style={styles.welcomeImage}
            resizeMode="contain"/>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
            <Animated.View 
            entering={FadeIn.duration(1000).springify().damping(12)}>
                <Text style={styles.footerTxt1}>
                    Always take control
                </Text>
                <Text style={styles.footerTxt1}>
                    of your finances
                </Text>
            </Animated.View>

            <Animated.View 
            entering={FadeIn.duration(1000).delay(100).springify().damping(12)}
            style={{ gap:2}}>
                <Text style={styles.footerTxt2}>
                    Before your finances controls you
                </Text>
            </Animated.View>

            <Animated.View 
            entering={FadeIn.duration(1000).delay(200).springify().damping(12)}
            style={styles.buttonContainer}>
                <Button onPress={() => router.push('/(auth)/register')}>
                    <Text style={{ fontSize: 22, color: Colors.white, fontWeight: 600}}>Get Started</Text>
                </Button>
            </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default welcome;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingTop: 7,
    },
    welcomeImage: {
      width: "100%",
      height: 300,
      alignSelf: "center",
      marginTop: 100
    },
    loginButton: {
      alignSelf: "flex-end",
      marginRight: 20,
    },
    footer: {
        backgroundColor: Colors.black,
        paddingTop: 30,
        paddingBottom: 45,
        gap: 20,
        shadowColor: "white",
        alignItems: 'center',
        shadowOffset: { width: 0, height: -10 },
        elevation: 10,
        shadowRadius: 25,
        shadowOpacity: 0.15,
    },
    buttonContainer: {
        width: "100%",
        paddingHorizontal: 25,
    },
    footerTxt1 : {
        fontWeight: 800,
        fontSize: 30,
        color: Colors.white,
        textAlign: 'center'
    },
    footerTxt2: {
        fontWeight: 400,
        fontSize: 17,
        color: Colors.white,
        textAlign: 'center'
    }
    
  });
  