import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import Colors from '@/constants/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import Input from '@/components/Input'
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import Button from '@/components/Button'
import { isLoaded } from 'expo-font'
import api from './api'
import CustomIconButton from '@/components/CustomIconButton'
import ColorList from '@/data/colors.json'
import iconList from '@/data/icons.json'


const addCategory = () => {
    const [icon, setIcon] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [selectedType, setSelectedType] = useState<'income' | 'expenses' | null>(null);
    const [categoryColor, setCategoryColor] = useState("");


    const createCategory = async () => {

        if (!icon || !categoryName || !selectedType || !categoryColor) {
            Alert.alert("Error", "Please fill all fields.");
            return;
        }

        console.log("category Type ",selectedType)
        
    
        try {
            const payload = {
                parent_name: selectedType ,
                icon: icon,
                color: categoryColor,
                name: categoryName
            };

            const res = await api.post('/api/categories/', payload);
            Alert.alert("Category Created!", `ID: ${res.data}`);
            
          } catch (error) {
            console.error(error.response?.data || error.message);
            Alert.alert("Error", "Failed to create category.");
          }
    };

    

    const toggleRadio = (type: 'income' | 'expenses') => {
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
                    focused={selectedType === 'expenses'}
                    onPress={() => toggleRadio('expenses')}
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
        <View style={{ height: 150 }}>
            <Text style={styles.groupHeaderTxt}>Category Icon</Text>
            <View style={{ flex : 1, flexDirection : 'row', gap : 10, flexWrap :'wrap', marginBottom: 10}}>
            {
                iconList.map((item)=> {
                    const iconName = item.iconName; // assume item.name has no trailing space
                    const iconFamily = item.iconFamily; // corrected to remove trailing space
                    const isSelectedIcon = icon === iconName;
                    return (
                            <TouchableOpacity key={iconName} onPress={() => setIcon(iconName)}>
                                <View style={{ 
                                    justifyContent: 'center', 
                                    alignItems:'center', 
                                    height: 40, 
                                    width: 40, 
                                    borderColor: isSelectedIcon ? Colors.white :'#666', 
                                    borderWidth: isSelectedIcon ? 2 : 1,
                                    borderRadius : 50
                                }}>
                                    {iconFamily === 'FontAwesome6' && <FontAwesome6 name={iconName} size={24} color={Colors.white} />}
                                    {iconFamily === 'MaterialIcons' && <MaterialIcons name={iconName} size={24} color={Colors.white} />}
                                    {iconFamily === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={iconName} size={24} color={Colors.white} />}
                                </View>
                            </TouchableOpacity>
                    )
                })
            }
            
            </View>
        </View>
        <View style={{ height: 200 }}>
            <Text style={styles.groupHeaderTxt}>Category Color</Text>  
            <View style={{ flex : 1, flexDirection : 'row', gap : 10, flexWrap :'wrap', marginBottom: 10}}>
            {
                
                ColorList.map((item)=> {
                    const colorCode = item['code ']; // assume item.code has no trailing space
                    const isSelected = categoryColor === colorCode;

                  return(
                    <TouchableOpacity key={colorCode} onPress={() => setCategoryColor(item['code '])}>
                        <View style={{ 
                            justifyContent: 'center', 
                            alignItems:'center', 
                            height: 40, 
                            width: 40, 
                            borderColor: isSelected ? Colors.white :'#666', 
                            borderWidth: isSelected ? 2 : 1,
                            borderRadius : 50
                        }}>
                            <View style={[styles.colorContainer, {backgroundColor: item['code ']}]}></View>
                        </View>
                    </TouchableOpacity>
                  )  
                })
            }
            </View> 
            <Button onPress={createCategory}>
                <Text style={styles.groupHeaderTxt}>Add</Text>
            </Button>
        </View>  
        
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
        marginBottom: 10,
    },
    footer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
      },
    colorContainer: {
        height : 30,
        width : 30,
        borderRadius : 30,
    }
})      