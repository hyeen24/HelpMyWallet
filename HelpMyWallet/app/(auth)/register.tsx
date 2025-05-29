import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import BackButton from '@/components/BackButton';
import ScreenWrapper from '@/components/ScreenWrapper';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import api from '../api';
import { AuthContext } from '@/contexts/AuthContext';
import { toTitleCase } from '@/utils/stringUtils';

const Register = () => {
  
  // variables
  const [ name, setName ] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [ email, setEmail ] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { register, isLoading } = useContext(AuthContext);

  // Handling Register, It first checks the field then It will call the handleSignUp from Context
  const handleRegister = async () => {
    const isValidName = (str: string) => /^[A-Za-z\s]+$/.test(name);

    if (!name || !email || !password) {
      Alert.alert('Fail to Sign Up', 'Please fill up all fields.');
      return;
    } 

    if (emailRegex.test(email) == false) {
      Alert.alert('Fail to Sign Up', 'Please enter a valid email address.');
      return;
    }
    
    if (password.length < 8 ) {
      Alert.alert('Fail to Sign Up','Please ensure password has the minimum length of 8 characters.')
      return;
    }

    if (!isValidName(name)) {
      Alert.alert("Fail to Sign Up","Name should only consist of alphabets.");
      return;
    }
    
    const isRegistered = await register(name, email.toLowerCase(), password);
    
    if (isRegistered) {
      router.push('/(auth)/login')
    } 
  }

  return (
    <ScreenWrapper>
        <View style={styles.container}>
            <BackButton/>
            <View style={{gap:5, marginTop: 5}}>
              <Text style={styles.registerTxt1}>Let's,</Text>
              <Text style={styles.registerTxt1}>Get Started</Text>
            </View>

        <View style={styles.form}>
          <Text style={{ fontSize: 16, color: Colors.white }}>
            Create an account to track your expenses
          </Text>
          <Input 
          placeholder="Enter your name" 
          onChangeText={(value) => {setName(value)}}
          icon={<FontAwesome name='address-book' size={26}
          color={Colors.neutral300}/>}
          />
          <Input 
          placeholder="Enter your email" 
          onChangeText={(value) => {setEmail(value)}}
          icon={<Feather name='mail' size={26}
          color={Colors.neutral300}/>}
          />
          <Input 
          placeholder="Enter your password" 
          secureTextEntry
          onChangeText={(value) => {setPassword(value)}}
          icon={<AntDesign name='lock' size={26}
          color={Colors.neutral300}/>}
          />
          {password.length < 8 && (
              <Text style={{ fontSize: 15, color: Colors.white}} > {'\u2022'} Minimum 8 characters</Text>
            )}
          
        </View>

        <Button loading={isLoading} onPress={handleRegister}>
          <Text  style={{ fontWeight: 700, color: Colors.black, fontSize: 21}} >Sign Up</Text>
        </Button>

        <View style={styles.footer}>
          <Text style={{ fontSize: 15, color: Colors.white}}>Already have an account?</Text>
          <Pressable onPress={()=> router.navigate("/(auth)/login")}>
            <Text style={{ fontSize: 15, fontWeight: 700, color: Colors.white}} >Login</Text>
          </Pressable>
        </View>

        </View>
    </ScreenWrapper>
  )
}

export default Register;

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
    registerTxt1 : {
      fontSize: 30,
      fontWeight: 800,
      color: Colors.white
    }
  })
  