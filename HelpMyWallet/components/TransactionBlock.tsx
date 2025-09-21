import { ListRenderItem, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { TransactionType } from '@/types'
import { FontAwesome, FontAwesome5, Foundation } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { darkTheme, lightTheme } from '@/constants/Theme'

const TransactionBlock = ({transactionList}: {transactionList: TransactionType[]}) => {
    const appTheme = useColorScheme();
    const Theme = appTheme === 'dark' ? darkTheme: lightTheme
    const router = useRouter();
   
  return (
    <View>
        <View style= {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10}}>
            <Text style={[styles.blockTitleTxt, {color: Theme.textColor}]}>My 
                <Text style={{ fontWeight: 700 , color: Theme.altTextColor}}> Transactions
                </Text>
            </Text>
            {
                transactionList.length > 0 ?
                (<TouchableOpacity onPress={() => {router.push('/transactions')}}>
                    <Text style={{ color: Theme.textColor, fontSize: 14}}>See all</Text>
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
                <View style={{ justifyContent:'center', alignItems:'center'}}>
                    <Text style={{ fontWeight: 400, color: Colors.white }}>No transaction record.</Text>
                </View>
            )
            
        }
        <View style={{ height : 50, justifyContent:'center', alignItems:'center', marginBottom: 80}}></View>
        

    </View>
  )
}

export default TransactionBlock

const styles = StyleSheet.create({
    expensBlockContainer : {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: 100,
        padding: 15,
        borderRadius: 15,
        marginRight: 20,
        gap : 8,
        marginBottom: 80        
    },
    blockTitleTxt: {
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