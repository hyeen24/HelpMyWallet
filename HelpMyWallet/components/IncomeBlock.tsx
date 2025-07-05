import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useState } from 'react'
import  Colors  from '@/constants/Colors'
import { IncomeType } from '@/types'
import { AntDesign, Feather, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { darkTheme, lightTheme } from '@/constants/Theme'
import { Dropdown } from 'react-native-element-dropdown'
import api from '@/app/api'

const IncomeBlock = ({incomeList, onRefresh} : {incomeList: IncomeType[],  onRefresh: () => void }) => {
    const [showMore, setShowMore] = useState("");
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const appTheme = useColorScheme();
    const Theme = appTheme === 'dark' ? darkTheme: lightTheme
    // console.log("Income List", incomeList)

    const toggleShowMore = (item: any) => {
        if (showMore != item.id){
            setShowMore(item.id)
        }else {
            setShowMore("")
        }
        console.log("Income Id:",showMore)
        
    }

    const deleteIncome = async () => {
        await api.delete(`api/category/delete/${showMore}/`).then((res) => {
            onRefresh();
        }).catch((err) => {
                const errorData =err.response.data;
                console.log(errorData);
            });
    }

    const renderItem:ListRenderItem<IncomeType> = ({item}) => {
            let amountString = item.amount ?? "0.00";
            let amount = amountString.split('.');
            let iconFamily = item.icon_type;
            let iconName = item.icon;
    
            return(
                <View>
                    <View style={[styles.incomeCategoryContainerTop, {backgroundColor : appTheme ==='dark'?  Colors.grey : Colors.tintColor} ]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={styles.categoryIconContainer}>
                                {!iconName || !iconFamily ? (
                                    <Feather name="help-circle" size={22} color={Theme.textColor} />
                                    ) : iconFamily === 'FontAwesome6' ? (
                                    <FontAwesome6 name={iconName} size={22} color={Theme.textColor}/>
                                    ) : iconFamily === 'MaterialIcons' ? (
                                    <MaterialIcons name={iconName as any} size={22} color={Theme.textColor} />
                                    ) : iconFamily === 'MaterialCommunityIcons' ? (
                                    <MaterialCommunityIcons name={iconName as any} size={22} color={Theme.textColor} />
                                    ) : null}
    
                            </View>
                            <TouchableOpacity onPress={()=>toggleShowMore(item)}>
                                <Feather name="more-horizontal" size={20} color={Theme.textColor}/>
                            </TouchableOpacity>   
                            {
                                showMore == item.id? (
                                     <View style={{position:'absolute',
                                        zIndex: 999, 
                                        backgroundColor: Theme.cardColors, 
                                        gap:8,
                                        borderRadius: 5,
                                        paddingHorizontal: 16,
                                        paddingVertical: 16,
                                        alignItems:'center',
                                        transform:[{
                                        translateY: 40
                                     }]}}>
                                <TouchableOpacity>
                                    <Text style={{color: Theme.textColor}}>Edit</Text>
                                </TouchableOpacity>
                                <View style={{ height: 1, backgroundColor: Colors.black }} />
                                <TouchableOpacity onPress={deleteIncome}>
                                    <Text style={{color: Theme.textColor}}>Delete</Text>
                                </TouchableOpacity>
                                
                            </View>
                                ) : null
                            }
                           
                        </View>
                        <Text style={{ color: Theme.textColor}}>{item.name}</Text>  
                        <Text style={[styles.incomeAmountWholeNumber, {color: Theme.textColor}]}>${amount[0]}.
                            <Text style={[styles.incomeAmountDecimalNumber, {color: Theme.textColor}]}>{amount[1]}</Text>
                        </Text>
                    </View>
                </View>
            );
    }
  return (
    <View style={{marginVertical: 5 }}>
        <View style= {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
            <Text style={[styles.blockTitleTxt, {color: Theme.textColor}]}>My 
                <Text style={{ fontWeight: 700, color: Theme.altTextColor }}> Income
                </Text>
            </Text>
        </View>
        {
            incomeList.length === 0 ? (
                <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{ color: Colors.white , fontWeight: 400}}>No Income Category</Text>
                </View>
            ) : (
                <FlatList 
                    data={incomeList} 
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}/>
            )
        }
    </View>
  )
}

export default IncomeBlock

const styles = StyleSheet.create({
    blockTitleTxt: {
        fontSize: 16
    },
    incomeCategoryContainerTop : {
        
        padding: 20, 
        borderRadius: 20, 
        marginRight: 15, 
        width: 150, 
        gap: 10
    },
    categoryIconContainer: {
        borderColor: '#666', 
        borderRadius: 50,
        padding: 10,
        borderWidth: 1,
        alignSelf: 'center',
    },
    incomeAmountWholeNumber: {
        fontSize: 16,
        fontWeight: 600
    },
    incomeAmountDecimalNumber: {
        fontSize: 12,
        fontWeight: 400
    },
     dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
})