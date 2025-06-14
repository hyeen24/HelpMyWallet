import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'

export type TransactionDetailProps = {
  imageUrl?: string;
}

const TransactionDetailBlock = ({
  imageUrl
} : TransactionDetailProps ) => {

  return (
    <View style={styles.container}>
      <Image src={imageUrl} style={styles.merchantImage}/>
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
  merchantImage:{
    width: 50, 
    height: 50,
    borderRadius: 10
  }
})