import { ListRenderItem, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { SpendingType } from '@/types'
import { FontAwesome, FontAwesome5, Foundation } from '@expo/vector-icons'

const SpendingBlock = ({spendingList}: {spendingList: SpendingType[]}) => {
   
  return (
    <View style={{ alignItems:'flex-start'}}>
        <Text style={styles.blockTitleTxt}>My 
            <Text style={{ fontWeight: 700 }}> Spending</Text>
        </Text>
        
        {spendingList.map((item) => {
            return(
              <View key={item.id} style={{ flexDirection: 'row', marginVertical: 10, alignItems:'center'}}>
               
                    <View style={styles.iconContainer}>
                        <Foundation name="dollar" size={22} color={Colors.white}/>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={{ gap: 5 }}>
                            <Text style={[styles.spendingTxt, { fontWeight: 700 }]}>{item.name}</Text>
                            <Text style={styles.spendingTxt}>{item.date}</Text>
                        </View>
                        <Text style={[styles.spendingTxt, { fontWeight: 700 }]}>${item.amount}</Text>
                    </View>
              </View>  
            );
        })}

    </View>
  )
}

export default SpendingBlock

const styles = StyleSheet.create({
    blockTitleTxt: {
            color: Colors.white,
            fontSize: 16,
            marginBottom: 20
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