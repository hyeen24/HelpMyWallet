import { Alert, FlatList, ListRenderItem, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Input from './Input';
import { useTheme } from '@/contexts/ThemeContext';
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import Button from './Button';
import AddNewExpenseGroup from './AddNewExpenseGroup';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddNewExpenseItem = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [ addNewGroup, setAddNewGroup ] = useState<boolean>(false);
    const [ categoryName, setCategoryName ] = useState("");
    const [ categoryColor, setCategoryColor ] = useState("#000000"); 
    const [ existingGroup, setExistingGroup ] = useState(null);
    const [ selectedExpenseGroup, setSelectedExpenseGroup ] = useState("None");
    const [ showDatePicker, setShowDatePicker] = useState(false);
    const [ selectedDate, setSelectedDate] = useState<Date | null>(new Date);

    const displayDatePicker = () => {
        setShowDatePicker(true);
    };

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('expenses');
            if (value !== null) {
            const expenses = JSON.parse(value)
            expenses.unshift({ id: "None", name: "None"})
            setExistingGroup(expenses);
            console.log("Existing Expenses: ", expenses)
            }
        } catch (e) {
            // error reading value
        }
        };

    const handleSelectExistingGroup = ({ item }: any) => {
        setSelectedExpenseGroup(item.id);
        console.log("Selected Existing Group: ", item)
    }

    const handleInputChange = (key:any, value: any) => {
        // setExpenseItem((prev)=> ({
        //     ...prev,
        //     [key]: value
        // }))
    }

    const onChangeDate = (event: any, date?: Date) => {
        setShowDatePicker(false);
        if (date) {
            setSelectedDate(date);
            handleInputChange("transaction_date", date.toISOString().split('T')[0]);
        }
    }

    const handleNewGroup = () => {
        setAddNewGroup(prev => !prev);
        console.log("Add New Group: ", addNewGroup)
        if (!addNewGroup) {
            setSelectedExpenseGroup("None")
        }
    }

    const handleNewExpense = async () => {

            }

    useEffect(()=>{
        getData();
    }, [])
         
    

    // useEffect(()=>{
    //     console.log(existingGroup)
    // }, [existingGroup])

  return (
    <ScrollView style={styles.container}>
        <View>
            <Text style={[styles.pageTitleTxt, {color: theme.textColor}]}>Add New Expense</Text>
            <Text style={[styles.pageTxt,  {color: theme.textColor, marginBottom: 20 , marginLeft: 20}]}>
                Let's add a new expense item{" "}
                <Text style={{ fontWeight: 600 }}>account.</Text>
            </Text>
        </View>
        <View>
            
            
            {showDatePicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                    style={{ width: "100%" }}
                  />
                )}
        </View>
        <View style={{ gap: 5}}>
            <View style={{ flexDirection: 'row'}}>
                <Text style={[styles.groupHeaderTxt, {color: theme.textColor, flex:3}]}>Amount Spend</Text>
                <Text style={[styles.groupHeaderTxt, {color: theme.textColor, flex:4}]}>Date</Text>
            </View>
            <View style={{ flexDirection: 'row' , gap: 20}}>     
                <Input
                    placeholder="Amount"
                    keyboardType='number-pad'
                    style={{ width: 70, color: theme.textColor }}
                    onChangeText={(value) => {
                        handleInputChange("amount", value);
                    }}
                    iconLeft={
                        <FontAwesome6
                        name="circle-dollar-to-slot"
                        size={18}
                        color={theme.textColor}
                        />
                    }
                />
                    <Button style={{
                        backgroundColor: theme.backgroundColor , 
                        borderWidth:1, 
                        flex: 1,
                        borderColor: '#666', 
                        alignItems: 'flex-start',
                        }}
                        onPress={displayDatePicker}>
                            <View style={{
                                flexDirection: 'row',
                                gap: 20,
                                paddingLeft: 15
                                    }}>
                                <FontAwesome6
                                    name="calendar-days"
                                    size={18}
                                    color={theme.textColor}
                                    />
                                    <Text style={{color: theme.textColor}}>{selectedDate ? selectedDate.toLocaleDateString("en-GB", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                }) : ''}</Text>
                            </View>
                    </Button>
            </View>
        </View>
        <View style={styles.sectionContainer}>
            <Text style={[styles.groupHeaderTxt, {color: theme.textColor}]}>Description</Text>
            <Input
                placeholder="Enter Description"
                style={{ flex:1, color: theme.textColor }}
                onChangeText={(value) => {
                    handleInputChange("description", value);
                }}
                iconLeft={
                    <SimpleLineIcons
                    name="note"
                    size={18}
                    color={theme.textColor}
                    />
                }/>

        </View>
        <View style={[styles.sectionContainer, { flexDirection: 'row' ,justifyContent: 'space-between', marginBottom: 5, alignItems: 'flex-end'}]}>
            <Text style={[styles.groupHeaderTxt, {color: theme.textColor}]}>Expense Group</Text>
            <Button style={{height: 32, width: addNewGroup? 150 : 32, borderRadius: 50, marginRight: 10}} 
                            onPress={handleNewGroup}>  
                                {
                                    addNewGroup ? (
                                        <Text style={{color: theme.textColor}}> Select Existing Group</Text>
                                    ) : (
                                        <View style={ {flexDirection:'row'}} >
                                            <FontAwesome6 size={18} name="add" color={theme.textColor}/>
                                        </View>
                                    )
                                }
                                
            </Button>
        </View>
        <View>
            {/* <Input
                placeholder="Enter Amount"
                keyboardType='number-pad'
                onChangeText={(value) => {
                    handleInputChange("amount", value);
                }}
                iconLeft={
                    <FontAwesome6
                    name="circle-dollar-to-slot"
                    size={18}
                    color={theme.textColor}
                    />
                }
                /> */}
                {
                    addNewGroup ? (
                        <View style={{height: 200}}>
                            <AddNewExpenseGroup 
                                categoryName={categoryName} 
                                setCategoryName={setCategoryName}
                                categoryColor={categoryColor}
                                setCategoryColor={setCategoryColor}/>
                        </View>
                    ) : (
                        <View style={{flexDirection:'row'}}>
                            {existingGroup && existingGroup.length > 1 ?  existingGroup.map((item) => (
                                <TouchableOpacity
                                    key={item.id} 
                                    style={
                                        { 
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            padding: 15,
                                            borderRadius: 8,
                                            marginRight: 20,
                                            gap : 8,
                                            backgroundColor: selectedExpenseGroup == item.id ? Colors.tintColor : theme.cardColors ,
                                            borderWidth : selectedExpenseGroup  == item.id ? 1: undefined,
                                            borderColor: selectedExpenseGroup  == item.id ? Colors.tintColor : undefined,
                                            opacity: selectedExpenseGroup  == item.id ? 0.7 : 1
                                        }
                                        
                                    }
                                    onPress={() => handleSelectExistingGroup({ item })}
                                    >
                                        {
                                            item.id === "None" ? (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5}}>
                                                    <MaterialCommunityIcons name="cancel" size={14} color={theme.textColor}/>
                                                    <Text style={{color: theme.textColor}}>None</Text>
                                                </View>
                                            ) : (
                                            <Text style={[styles.expenseBlockTitle, { color: theme.textColor }]}>
                                                {item.name}
                                            </Text> 
                                            )
                                        }
                                    
                                </TouchableOpacity>
                            )) : (
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, marginLeft: 40}}>3
                                    
                                    <Text style={{color: '#ccc'}}> No Existing Group</Text>
                                </View>
                            )
                        }
                        </View>
                    )
                }

            <View style={{marginTop: 20}}>
                <Button onPress={handleNewExpense}>
                    <Text style={[styles.groupHeaderTxt, {color:theme.textColor}]}>Add</Text>
                </Button>
            </View>
        </View>
    </ScrollView>
  )
}

export default AddNewExpenseItem

const styles = StyleSheet.create({
    container: {
        height: 150, 
        gap: 50
    },
    groupHeaderTxt: {
        fontSize: 14,
        paddingBottom: 8,
        fontWeight: 600,
      },
    pageTitleTxt: {
      fontSize: 24,
      fontWeight: 700,
    },
    pageTxt: {
      fontSize: 12,
      marginBottom: 10,
    },
    sectionContainer: {
        marginTop: 20,
        gap:5
    },
    expenseBlockTitle: {
        fontSize: 12,
    },
})