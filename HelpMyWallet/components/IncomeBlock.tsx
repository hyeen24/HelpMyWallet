import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import  Colors  from '@/constants/Colors'
import { IncomeType } from '@/types'
import { Feather, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { darkTheme, lightTheme } from '@/constants/Theme'

const IncomeBlock = ({incomeList} : {incomeList: IncomeType[]}) => {
    const appTheme = useColorScheme();
    const Theme = appTheme === 'dark' ? darkTheme: lightTheme
    console.log("Income List", incomeList)
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
                            <TouchableOpacity onPress={() => {}}>
                                <Feather name="more-horizontal" size={20} color={Theme.textColor}/>
                            </TouchableOpacity>   
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
})