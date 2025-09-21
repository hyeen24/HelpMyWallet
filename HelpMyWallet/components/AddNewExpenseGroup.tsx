import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Input from './Input';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import ColorList from "@/data/colors.json";
import Button from './Button';
// import { Dropdown } from 'react-native-element-dropdown';
import { toTitleCase } from '@/utils/stringUtils';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { AddNewExpenseGroupProps } from '@/types';



const AddNewExpenseGroup = ({
    categoryName,
    setCategoryName,
    categoryColor,
    setCategoryColor
}: AddNewExpenseGroupProps) => {

    const { theme } = useTheme();
    const router = useRouter();
    const { user } = useAuth();

    const fetchMerchantCategories = async () => {
        // try {
        //     const res = await api.get('/api/merchants/');
        //     const resData = res.data;
        //     console.log("Merchant Data: ", resData);
        //     setMerchantData(resData);
           
        // } catch (error: any) {
        //     const errorMessage = error.response?.data?.message || "An error occurred";
        //     Alert.alert("Error", errorMessage);
        // }
    };


    useEffect(() => {
        fetchMerchantCategories();
    }, []);

    const createNewExpensesGroup = async () => {
        const payLoad = {
            name: categoryName,
            color: categoryColor,
            author_id: user.userId || "",
        }

        try {

        const response = await client.graphql({
            query: mutations.createExpenseGroup,
            variables: { input: payLoad }
            });
            Alert.alert("New Expense Created", "Your expense group has been added successfully.", [
                {
                text: "OK",
                onPress: () => router.push("/(tabs)/home"),
                },
            ]);
    
            // const response = await client.graphql({
            //   query: mutations.createCalendar,
    
            // })
        } catch (error) {
            console.error("Error creating expense group:", error);
            Alert.alert("Error", "Failed to create expense group. Please try again.");
        }
        
    };


  return (
    <View style={styles.container}>
        <View>
            <Input
            placeholder="Enter category type"
            onChangeText={(value) => {
                setCategoryName(value);
            }}
            iconLeft={
                <MaterialIcons
                name="category"
                size={24}
                color={theme.textColor}
                />
            }
            />
        </View>
        <View style={{ height:150 }}>
            <Text style={[styles.groupHeaderTxt, { color: theme.textColor}]}>Grouping Color</Text>
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
                        borderColor: isSelected ? Colors.tintColor: "#666",
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
        {/* <View>
            <Text style={[styles.groupHeaderTxt, {color: theme.textColor}]}>Tag Merchant</Text>
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
                                    <Text style={{ color: theme.textColor, fontSize: 16 }}>{toTitleCase(merchant.name)}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={{ marginLeft: 20 ,color: theme.textColor }}>No merchants found.</Text>
                        )
}
                </View>
        </View>
        <View>
            <Button onPress={()=>createNewExpensesGroup()}>
                <Text style={[styles.groupHeaderTxt, {color:Colors.white}]}>Add</Text>
            </Button>
        </View>     */}
    </View>
  )
}

export default AddNewExpenseGroup

const styles = StyleSheet.create({
    container: {
        height: 150, 
        marginTop: 8,
        gap: 20
    },
    groupHeaderTxt: {
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
        },
    containerExistingMerchantItem2: {
        justifyContent:'center',
        alignItems:'center', 
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: Colors.neutral400,
        borderWidth: 1,
        padding: 10,
    },

})