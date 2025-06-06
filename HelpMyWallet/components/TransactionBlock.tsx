import { ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { TransactionType } from '@/types'
import { FontAwesome, FontAwesome5, Foundation } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const TransactionBlock = ({transactionList}: {transactionList: TransactionType[]}) => {

    const router = useRouter();
   
  return (
    <View>
        <View style= {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text style={styles.blockTitleTxt}>My 
                <Text style={{ fontWeight: 700 }}> Transactions
                </Text>
            </Text>
            {
                transactionList.length > 0 ?
                (<TouchableOpacity onPress={() => {router.push('/transactions')}}>
                    <Text style={{ color: Colors.white, fontSize: 14}}>See all</Text>
                </TouchableOpacity>) : 
                null
            }
        </View>
        {
            transactionList && transactionList.length > 0 ? (
                transactionList.map((item) => (
                    <View key={item.ref_number} style={{ flexDirection: 'row', marginVertical: 10, alignItems:'center'}}>
                        <View style={styles.iconContainer}>
                            <Foundation name="dollar" size={22} color={Colors.white}/>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{ gap: 5 }}>
                                <Text style={[styles.spendingTxt, { fontWeight: 700 }]}>{item.description}</Text>
                                <Text style={styles.spendingTxt}>{item.trans_date}</Text>
                            </View>
                            <Text style={[styles.spendingTxt, { fontWeight: 700 }]}>${item.amount}</Text>
                        </View>
                    </View>  
                ))
            ) : (
                <View style={{ height : 100, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{ fontWeight: 400, color: Colors.white }}>No transaction record.</Text>
                </View>
            )
            
        }
        

    </View>
  )
}

export default TransactionBlock

const styles = StyleSheet.create({
    blockTitleTxt: {
            color: Colors.white,
            fontSize: 16,
    },
    spendingTxt : {
        color: Colors.white
    },
    iconContainer : {
        backgroundColor: Colors.grey,
        width:40, 
        height:40, 
        padding: 10 , 
        borderRadius:50 ,
        marginRight: 10, 
        justifyContent:'center',
        alignItems: 'center'
    
    }

})