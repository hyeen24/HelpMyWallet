import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useRouter } from 'expo-router'
import Colors from '@/constants/Colors';
import { AntDesign, Feather } from '@expo/vector-icons';
import BackButton from '@/components/BackButton';

const Login= () => {

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if(!emailRef.current || !passwordRef.current){
      Alert.alert('Login','Please fill up all fields.')
      return;
    }

    // const response = await SignIn({ username:emailRef.current, password:passwordRef.current})

    // if (response.success == true) {
    //   console.log("Login success")
    // } else {
    //   Alert.alert('Sign In Failed!',response.msg)
    // }
  }

  return (
    <ScreenWrapper>
        <View style={styles.container}>
            <BackButton/>
            <View style={{gap:5, marginTop: 20}}>
              <Text style={styles.loginTxt1}>
                Hey,
              </Text>
              <Text style={styles.loginTxt1}>
                Welcome Back
              </Text>
            </View>

        <View style={styles.form}>
          <Text style={{ fontSize: 16, color: Colors.white}}>
            Login now to track all your expenses
          </Text>
          <Input 
          placeholder="Enter your email" 
          onChangeText={(value) => {emailRef.current = value}}
          icon={<Feather name='mail' size={26}
          color={Colors.white}/>}
          />
          <Input 
          placeholder="Enter your password" 
          secureTextEntry
          onChangeText={(value) => {passwordRef.current = value}}
          icon={<AntDesign name='lock' size={26}
          color={Colors.white}/>}
          />
        </View>
        <Pressable onPress={() => {}}>
          <Text  style={{fontSize: 14, color: Colors.white, alignSelf: 'flex-end'}} >Forget Password?</Text>
        </Pressable>
        <Button loading={isLoading} onPress={handleSignIn}>
          <Text style={{ fontWeight: 700, color: Colors.black, fontSize: 21 }}>Login</Text>
        </Button> 

        <View style={styles.footer}>
          <Text style={{color: Colors.white, fontSize: 15 }}>Don't have an account?</Text>
          <Pressable onPress={()=> router.push('/(auth)/register')}>
            <Text style={{ fontSize: 15, fontWeight: 700, color : Colors.white
            }}>Sign up</Text>
          </Pressable>
        </View>

        </View>
    </ScreenWrapper>
  )
}

export default Login;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      gap: 30,
      paddingHorizontal: 20,
    },
    welcomeText: {
      fontSize: 20,
      fontWeight: "bold",
      color: Colors.white,
    },
    form: {
      gap: 20,
    },
    forgotPassword: {
      textAlign: "right",
      fontWeight: "500",
      color: Colors.white,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 5,
    },
    footerText : {
        textAlign: "center",
        color: Colors.white,
        fontSize: 15
    },
    loginTxt1 : {
      fontSize: 30,
      fontWeight: 800,
      color: Colors.white
    }
  });
  