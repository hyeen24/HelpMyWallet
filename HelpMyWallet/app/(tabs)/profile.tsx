import { StyleSheet, Text, TouchableOpacity, useColorScheme, View , Switch} from 'react-native'
import React, { useState } from 'react'
import Colors from '@/constants/Colors'
import { Stack } from 'expo-router'
import PageHeader from '@/components/PageHeader';
import { darkTheme, lightTheme } from '@/constants/Theme';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const profile = () => {
  const appTheme = useColorScheme();
  const Theme = appTheme === 'dark' ? darkTheme : lightTheme;
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <>
        <Stack.Screen options={{headerShown: true,
          header: () => (<PageHeader title="Settings"/>),
            headerTransparent: true    
        }}/>
          <View style={[styles.container, { backgroundColor: Theme.backgroundColor }]}>
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <TouchableOpacity style={{ flex:1, height: 50, justifyContent: 'space-between', flexDirection:'row', alignItems:'center'}}>
                <View style={{flexDirection:'row', gap: 10, alignItems:'center'}}>
                <MaterialIcons name="dark-mode" size={24} color={Theme.textColor} />
                <Text style={{color: Theme.textColor}}>Dark Mode</Text>
                </View>
                <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  />
                
              </TouchableOpacity>
            </View> */}
            <TouchableOpacity style={styles.lineItemContainer}>
              <View style={{flexDirection:'row', gap: 10, alignItems:'center'}}>
              <AntDesign name="user" size={18} color={Theme.textColor} />
              <Text style={[styles.lineItemTxt, {color: Theme.textColor}]}>Change Avatar</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lineItemContainer}>
              <View style={{flexDirection:'row', gap: 10, alignItems:'center'}}>
              <AntDesign name="key" size={18} color={Theme.textColor} />
              <Text style={[styles.lineItemTxt, {color: Theme.textColor}]}>Change Password</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lineItemContainer}>
              <View style={{flexDirection:'row', gap: 10, alignItems:'center'}}>
              <AntDesign name="delete" size={18} color={Theme.textColor} />
              <Text style={[styles.lineItemTxt, {color: Theme.textColor}]}>Delete Account</Text>
              </View>
            </TouchableOpacity>
              
            
            </View>
    </>
  )
}

export default profile

const styles = StyleSheet.create({
    container: {
      marginTop: 80,
      paddingTop: 10,
      flex: 1,
      paddingHorizontal: 10,
      gap: 18
        // backgroundColor moved to inline style in component
    },
    lineItemContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    lineItemTxt : {
      fontSize : 18
    }
})