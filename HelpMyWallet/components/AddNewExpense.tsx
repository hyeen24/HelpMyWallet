import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Input from './Input';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import ColorList from "@/data/colors.json";
import Button from './Button';
import api from '@/app/api';
import { Dropdown } from 'react-native-element-dropdown';
import { toTitleCase } from '@/utils/stringUtils';
import { useRouter } from 'expo-router';

const AddNewExpense = () => {
    const [categoryName, setCategoryName] = useState("");
    const [categoryColor, setCategoryColor] = useState("#000000"); // Default color
    const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
    const [merchantData, setMerchantData] = useState([]);
    const router = useRouter();

    const fetchMerchantCategories = async () => {
        try {
            const res = await api.get('/api/merchants/');
            const resData = res.data;
            console.log("Merchant Data: ", resData);
            setMerchantData(resData);
           
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "An error occurred";
            Alert.alert("Error", errorMessage);
        }
    };

    useEffect(() => {
        fetchMerchantCategories();
    }, []);

    const createNewExpensesGroup = async () => {
        const payload = {
            parent_name: "expenses",
            name: categoryName,
            color: categoryColor,     
        };

        await api.post("/api/categories/", payload).then((res) => {
            Alert.alert("Category", `Category created`, [
          {
            text: "OK",
            onPress: () => {
              router.push("/(tabs)/home");
            },
          },
        ]);

           console.log("Creating expenses", res)
        }).catch((error)=> {
            const errorMessage = error.response?.data?.message || "An error occurred";
            Alert.alert("Error", errorMessage);
        })
        
    };


  return (
    <View style={styles.container}>
        <View>
            <Text style={styles.groupHeaderTxt}>Expenses Group</Text>
            <Input
            placeholder="Enter category type"
            onChangeText={(value) => {
                setCategoryName(value);
            }}
            iconLeft={
                <MaterialIcons
                name="category"
                size={24}
                color={Colors.white}
                />
            }
            />
        </View>
        <View style={{ height:150 }}>
            <Text style={styles.groupHeaderTxt}>Grouping Color</Text>
            <View
                style={{
                flex: 1,
                flexDirection: "row",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 10,
                }}
            >
                {ColorList.map((item) => {
                const colorCode = item["code "]?.trim(); // remove trailing space if necessary
                const isSelected = categoryColor === colorCode;

                return (
                    <TouchableOpacity
                    key={colorCode}
                    onPress={() => setCategoryColor(colorCode)}
                    >
                    <View
                        style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                        width: 40,
                        borderColor: isSelected ? Colors.white : "#666",
                        borderWidth: isSelected ? 2 : 1,
                        borderRadius: 50,
                        }}
                    >
                        <View
                        style={[
                            styles.colorContainer,
                            { backgroundColor: colorCode },
                        ]}
                        />
                    </View>
                    </TouchableOpacity>
                );
                })}
            </View>
        </View>
        <View>
            <Text style={styles.groupHeaderTxt}>Tag Merchant</Text>
            <View style={styles.containerExistingMerchant}>
                    {
                        merchantData.length > 0 ? (
                            merchantData.map((merchant: any) => (
                                <TouchableOpacity key={merchant.id} style={ 
                                    selectedMerchant === merchant.id ? styles.containerExistingMerchantItem2 : styles.containerExistingMerchantItem
                                } onPress={()=>setSelectedMerchant(merchant.id)}>
                                    <Image
                                        source={{
                                            uri: merchant.icon ? merchant.icon.replace('/media', '/api/media') : '',
                                        }}
                                        style={{ width: 50, height: 50, borderRadius: 25, marginBottom: 5 }}/>
                                    <Text style={{ color: Colors.white, fontSize: 16 }}>{toTitleCase(merchant.name)}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={{ color: Colors.white }}>No merchants found.</Text>
                        )
}
                </View>
        </View>
        <View>
            <Button onPress={()=>createNewExpensesGroup()}>
                <Text style={[styles.groupHeaderTxt, {color:Colors.white}]}>Add</Text>
            </Button>
        </View>    
    </View>
  )
}

export default AddNewExpense

const styles = StyleSheet.create({
    container: {
        height: 150, 
        marginTop: 20,
        gap: 20
    },
    groupHeaderTxt: {
        color: Colors.white,
        fontSize: 14,
        paddingBottom: 8,
        fontWeight: 600,
      },
    colorContainer: {
    height: 30,
    width: 30,
    borderRadius: 30,
  },
  containerExistingMerchant: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
    },
    containerExistingMerchantItem: {
            justifyContent:'center',
            alignItems:'center', 
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 1,
            padding: 10,
            borderColor: Colors.neutral700
        },
    containerExistingMerchantItem2: {
        justifyContent:'center',
        alignItems:'center', 
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: Colors.neutral400,
        borderWidth: 1,
        padding: 10,
        borderColor: Colors.neutral700
    },

})