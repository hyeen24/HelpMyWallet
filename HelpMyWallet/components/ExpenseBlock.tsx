import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ExpenseType } from '@/types';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import addCategory from '@/app/addCategory';

const ExpenseBlock = ({expenseList} : {expenseList: ExpenseType[]}) => {
    const router = useRouter();
    console.log("Expenses", expenseList)

    const totalAmount = expenseList.reduce((sum, expense) => {
        return sum + parseFloat(expense.amount);
      }, 0);

    const renderItem: ListRenderItem<Partial<ExpenseType>> = ({item, index}) => {
        if ( index == 0 ) {
            return (
                <TouchableOpacity onPress={() => router.navigate('/addCategory')}>
                    <View style={styles.addCategoryView}>
                        <Feather name="plus" size={22} color={'#ccc'} />
                    </View>
                </TouchableOpacity>
            );
        }
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
                <Text style={[styles.expenseBlockTitle, { color : TxtColor}]}>{item.name}</Text>
                <Text style={[styles.expenseAmountWholeNumber, { color : TxtColor}]}>${amount[0]}.
                    <Text style={[styles.expenseAmountDecimalNumber, { color: TxtColor}]}>{amount[1]}</Text>
                </Text>
                <View style={styles.expensePercentageView}>
                    <Text style={[styles.expenseBlockTitle, { color: TxtColor }]}>{percentage}%</Text>
                </View>
            </View>
        );
    };

    const staticItem = [{ name: "Add Item"}];

  return (
    <View>
        {
            expenseList.length === 0 ? (
                <View style={{flexDirection: 'row',justifyContent:'center', alignItems: 'center', marginBottom: 20}}>
                    <TouchableOpacity onPress={() => router.navigate('/addCategory')}>
                        <View style={styles.addCategoryView}>
                            <Feather name="plus" size={22} color={'#ccc'} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.expenseBlockEmpty}>
                        <Text style={[styles.expenseBlockTitle,{color: Colors.white}]}>No Expense Category</Text>
                    </View>
                </View>
            ) : (
                <FlatList 
                  data={staticItem.concat(expenseList)} 
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
        backgroundColor: Colors.tintColor,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: 100,
        padding: 15,
        borderRadius: 15,
        marginRight: 20,
        gap : 8
    },
    expenseBlockEmpty: {
        backgroundColor: Colors.neutral700,
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
        borderColor: '#666',
        borderStyle: "dashed",
        borderRadius: 10,
        marginRight: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',

    }

})