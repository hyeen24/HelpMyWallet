import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { IncomeType } from '@/types'
import { Feather, FontAwesome6 } from '@expo/vector-icons'

const IncomeBlock = ({incomeList} : {incomeList: IncomeType[]}) => {
    const renderItem:ListRenderItem<IncomeType> = ({item}) => {
        let amountString = item.amount ?? "0.00";
        let amount = amountString.split('.');

        return(
            <View>
                <View style={styles.incomeCategoryContainerTop}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={styles.categoryIconContainer}>
                            <FontAwesome6 name="sack-dollar" size={22} color={Colors.white}/>
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
        alignSelf: 'flex-start',
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