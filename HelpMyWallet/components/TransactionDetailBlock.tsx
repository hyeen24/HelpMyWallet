import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'



const TransactionDetailBlock = ({
  imageUrl,
  amount
} : TransactionDetailProps ) => {

  return (
    <View style={styles.container}>
      <Image src={imageUrl} style={styles.merchantImage}/>
      <Text style={styles.amountTxt}>${amount}</Text>
   
    </View>
  )
}

export default TransactionDetailBlock

const styles = StyleSheet.create({
  container:{
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center'
  },
 


})