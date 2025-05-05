import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Colors from '@/constants/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import Input from '@/components/Input'
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import Button from '@/components/Button'
import { isLoaded } from 'expo-font'
import api from './api'
import CustomIconButton from '@/components/CustomIconButton'

const addCategory = () => {
    const [categoryType, setCategoryType] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [selectedType, setSelectedType] = useState<'income' | 'expense' | null>(null);

    const createCategory = async () => {
        try {
            const payload = {
                categoryName
                // icon
                //color
            };

            const res = await api.post('/api/categories/', {name:categoryName});
            Alert.alert("Category Created!", `ID: ${res.data.id}`);
          } catch (error) {
            console.error(error.response?.data || error.message);
            Alert.alert("Error", "Failed to create category.");
          }
    };

    

    const toggleRadio = (type: 'income' | 'expense') => {
        setSelectedType(prev => (prev === type ? null : type));
    };

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.pageTitleTxt}>Add New Category</Text>
        <Text style={styles.pageTxt}>Let's add a new category for your <Text style={{ fontWeight: 600 }}>transactions</Text>.</Text>
        <View>
            <Text style={styles.groupHeaderTxt}>Category Type</Text>
            <View style={{ flexDirection: 'row', gap: 10}}>
                <CustomIconButton 
                    icon={<MaterialCommunityIcons name='gold' size={22} color={Colors.white}/>} 
                    text='Income'
                    focusable={true}
                    focused={selectedType === 'income'}
                    onPress={() => toggleRadio('income')}
                    />

                    <CustomIconButton 
                    icon={<FontAwesome6 name='hand-holding-dollar' size={22} color={Colors.white}/>} 
                    text='Expenses'
                    focusable={true}
                    focused={selectedType === 'expense'}
                    onPress={() => toggleRadio('expense')}
                    />
                </View>
            </View>
        <View>
            <Text style={styles.groupHeaderTxt}>Category Name</Text>
            <Input 
            placeholder="Enter category type" 
            onChangeText={(value) => {setCategoryName(value)}}
            icon={<MaterialIcons name='category' size={24}
            color={Colors.white}/>}
            />
        </View>
        <View>
            <Text style={styles.groupHeaderTxt}>Category Icon</Text>
        </View>
        <View>
            <Text style={styles.groupHeaderTxt}>Category Color</Text>   
        </View>  
        <Button onPress={createCategory}>
                <Text style={styles.groupHeaderTxt}>Add</Text>
        </Button>
    </SafeAreaView>
  )
}

export default addCategory

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
        gap : 20,
        backgroundColor: Colors.black,
        paddingHorizontal: 10
      },
    pageTitleTxt : {
        fontSize: 24,
        color: Colors.white,
        fontWeight: 700
    },
    groupHeaderTxt: {
        color: Colors.white,
        fontSize: 14,
        paddingBottom: 8,
        fontWeight: 600
    },
    pageTxt : {
        color: Colors.white,
        fontSize: 12,
        marginBottom: 30,
    },
    footer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
      }
})      