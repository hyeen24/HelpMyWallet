import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { IncomeType } from '@/types'
import { Feather, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

const IncomeBlock = ({incomeList} : {incomeList: IncomeType[]}) => {
    console.log("Income List", incomeList)
    const renderItem:ListRenderItem<IncomeType> = ({item}) => {
        let amountString = item.amount ?? "0.00";
        let amount = amountString.split('.');
        let iconFamily = item.icon_type;
        let iconName = item.icon;

        return(
            <View>
                <View style={styles.incomeCategoryContainerTop}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={styles.categoryIconContainer}>
                            {!iconName || !iconFamily ? (
                                <Feather name="help-circle" size={22} color={Colors.white} />
                                ) : iconFamily === 'FontAwesome6' ? (
                                <FontAwesome6 name={iconName} size={22} color={Colors.white} />
                                ) : iconFamily === 'MaterialIcons' ? (
                                <MaterialIcons name={iconName as any} size={22} color={Colors.white} />
                                ) : iconFamily === 'MaterialCommunityIcons' ? (
                                <MaterialCommunityIcons name={iconName as any} size={22} color={Colors.white} />
                                ) : null}

                        </View>
                        <TouchableOpacity onPress={() => {}}>
                            <Feather name="more-horizontal" size={20} color={Colors.white}/>
                        </TouchableOpacity>   
                    </View>
                    <Text style={{ color: Colors.white}}>{item.name}</Text>  
                    <Text style={styles.incomeAmountWholeNumber}>${amount[0]}.
                        <Text style={styles.incomeAmountDecimalNumber}>{amount[1]}</Text>
                    </Text>
                </View>
            </View>
        );
    }
  return (
    <View style={{marginVertical: 20}}>
        <Text style={styles.blockTitleTxt}>My 
            <Text style={{ fontWeight: 700 }}> Income
            </Text>
        </Text>
        <FlatList 
            data={incomeList} 
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}/>
    </View>
  )
}

export default IncomeBlock

const styles = StyleSheet.create({
    blockTitleTxt: {
        color: Colors.white,
        fontSize: 16,
        marginBottom: 20
    },
    incomeCategoryContainerTop : {
        backgroundColor: Colors.grey, 
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
        fontWeight: 600,
        color: Colors.white
    },
    incomeAmountDecimalNumber: {
        fontSize: 12,
        fontWeight: 400,
        color: Colors.white
    },
})