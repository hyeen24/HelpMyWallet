import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import PageHeader from '@/components/PageHeader'
import { AntDesign, Entypo, FontAwesome, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import  Colors from '@/constants/Colors'
import ButtonSpaceBetweenTwoItem from '@/components/ButtonSpaceBetweenTwoItem'
import { toTitleCase } from '@/utils/stringUtils'



const transactionDetails = () => {
  const { merchantIcon, merchantName,merchantId, itemAmount, itemDescription, transactionDate} = useLocalSearchParams();
  console.log("Merchant Name",merchantName)
  console.log("Merchant Icon", merchantIcon)

  const moveToMerchant = (merchantId : string)=> {
    console.log("Merchant ID:", merchantId);
    if (merchantName === "Unknown") {
       router.push('/addMerchant')
      
    } else {
      console.log("Merchant Name is known, redirecting to merchantDetails")
      router.push({
            pathname: '/merchantDetails',
            params: {
                merchantId
            }
        });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.black}}>
        <PageHeader
            title="Transactions Details"
            rightButton={<MaterialIcons name="notifications" size={22} color={Colors.white}/>}
            onPress={()=>{}}/>
        
        <View style={styles.container}>
          {
            merchantIcon === '' ? (
              <Fontisto name="shopping-store" size={50} color={Colors.white}/>
            ) : (
              <Image
            source={{
              uri:
                typeof merchantIcon === 'string'
                  ? merchantIcon.replace('/media', '/api/media')
                  : undefined,
            }}
            style={styles.merchantImage}
          />
            ) 
          }
          
                <Text style={styles.amountTxt}>${itemAmount}</Text>
                <Text style={styles.descTxt}>{itemDescription}</Text>
                <Text style={styles.dateTxt}> {transactionDate} </Text>
          <ButtonSpaceBetweenTwoItem
            leftTxt='Merchant'
            rightTxt={toTitleCase(merchantName)}
            leftIcon={<Entypo name='shop' size={22} color={Colors.black}/>}
            rightIcon={<AntDesign name='right' size={22}
              color={Colors.black}
              weight="bold"
              />}
              onPress={() => moveToMerchant(merchantId)}/>
          <ButtonSpaceBetweenTwoItem
            leftTxt='Date'
            rightTxt={transactionDate}
            leftIcon={<FontAwesome name='calendar' size={22} color={Colors.black}/>}
            />
        </View>
    </View>
  )
}

export default transactionDetails

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: Colors.black,
  paddingTop: 24,               // ✅ Add spacing manually
  paddingHorizontal: 16,
  alignItems: 'center',
  gap: 16,
},
   merchantImage:{
    width: 100, 
    height: 100,
    borderRadius: 10
  },
  amountTxt : {
    fontSize: 36,
    fontWeight: 700,
    color: Colors.white
  },
  fontTxt : {
    fontSize: 16
  },
  descTxt: {
    color: Colors.white
  },
  dateTxt : {
    color: Colors.neutral400
  }
})