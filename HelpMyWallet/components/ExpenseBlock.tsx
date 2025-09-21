import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { ExpenseType } from '@/types';
import  Colors  from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import addCategory from '@/app/addCategory';
import { darkTheme, lightTheme } from '@/constants/Theme';

const ExpenseBlock = ({expenseList} : {expenseList: ExpenseType[]}) => {
    const router = useRouter();
    const appTheme = useColorScheme();
    const Theme = appTheme === 'dark' ? darkTheme: lightTheme
    // console.log("Theme",appTheme)
    // console.log("Expenses", expenseList)

    const totalAmount = expenseList.reduce((sum, expense) => {
        return sum + parseFloat(expense.amount);
      }, 0);

    const renderItem: ListRenderItem<Partial<ExpenseType>> = ({item, index}) => {

        let amountString = item.amount ?? "0.00";
        let amount = amountString.split('.');
        let percentage = Math.floor((parseFloat(amountString) / totalAmount) * 100);

        let BlockColor = item.color
        let TxtColor;

        // switch (item.name) {
        //     case "Food" :
        //         BlockColor = Colors.blue;
        //         TxtColor = Colors.black;
        //         break;
        //     case "Entertainment" :
        //         BlockColor = Colors.tintColor;
        //         TxtColor = Colors.white;
        //         break;
        //     default:
        //         BlockColor = Colors.white;
        //         TxtColor = Colors.black;
        //         break;
        // }

        return(
            <View style={[styles.expenseBlock,
                {
                    backgroundColor: BlockColor
                }
            ]}>
                <Text style={[styles.expenseBlockTitle, { color : Theme.textColor}]}>{item.name}</Text>
                <Text style={[styles.expenseAmountWholeNumber, { color : Theme.textColor}]}>${amount[0]}.
                    <Text style={[styles.expenseAmountDecimalNumber, { color: Theme.textColor}]}>{amount[1]}</Text>
                </Text>
                <View style={styles.expensePercentageView}>
                    <Text style={[styles.expenseBlockTitle, { color: TxtColor }]}>{percentage}%</Text>
                </View>
            </View>
        );
    };

  return (
    <View>
        {
            expenseList.length === 0 ? (
                <View style={{flexDirection: 'row',justifyContent:'center', alignItems: 'center', marginBottom: 20}}>
                    <View style={[styles.expenseBlockEmpty, {backgroundColor: appTheme == 'dark'? 
        Colors.neutral700 : Colors.lightTintColor}]}>
                        <Text style={[styles.expenseBlockTitle,{ color: Colors.white}]}>No Expense Category</Text>
                    </View>
                </View>
            ) : (
                <FlatList 
                  data={expenseList} 
                  renderItem={renderItem} 
                  horizontal 
                  showsHorizontalScrollIndicator={false}/> 
            )
        }
    </View>
  )
}

export default ExpenseBlock

const styles = StyleSheet.create({
    expenseBlock: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: 100,
        padding: 15,
        borderRadius: 15,
        marginRight: 20,
        gap : 8
    },
    expenseBlockEmpty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 100,
        padding: 15,
        borderRadius: 15,
        marginRight: 20,
    },
    
    expenseBlockTitle: {
        fontSize: 14,
        fontWeight: 600
    },
    expenseAmountWholeNumber: {
        fontSize: 16,
        fontWeight: 600
    },
    expenseAmountDecimalNumber: {
        fontSize: 12,
        fontWeight: 400
    },
    expensePercentageView : {
        backgroundColor : 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 10
    },
    addCategoryView : {
        flex:1,
        borderWidth: 2,
        
        borderStyle: "dashed",
        borderRadius: 10,
        marginRight: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',

    }

})