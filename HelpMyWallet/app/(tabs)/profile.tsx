import { StyleSheet, Text, TouchableOpacity, useColorScheme, View , Switch} from 'react-native'
import React, { useState } from 'react'
import Colors from '@/constants/Colors'
import { Stack } from 'expo-router'
import PageHeader from '@/components/PageHeader';
import { darkTheme, lightTheme } from '@/constants/Theme';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

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
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
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
            </View>
            </View>
    </>
  )
}

export default profile

const styles = StyleSheet.create({
    container: {
      marginTop: 90,
      flex: 1,
      paddingHorizontal: 20,
        // backgroundColor moved to inline style in component
    }
})