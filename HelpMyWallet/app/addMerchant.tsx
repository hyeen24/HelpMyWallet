import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import api from './api';
import Colors from '@/constants/Colors';
import PageHeader from '@/components/PageHeader';
import { MaterialIcons } from '@expo/vector-icons';

const addMerchant = () => {
    const [merchantData, setMerchantData] = useState<any[]>([]);

    const fetchData = async () => {

        try {
            const response = await api.get("api/merchants/");
            const merchantData = response.data
            setMerchantData(merchantData);
            // console.log("Merchant:", merchantData);
        } catch (err) {
            console.error("API fetch error:", err);
        }
        console.log("Merchant Data:", merchantData);
        };
    
  return (
     <View style={{ flex: 1, backgroundColor: Colors.black}}>
        <PageHeader
            title="Add Merchant"
            rightButton={<MaterialIcons name="notifications" size={22} color={Colors.white}/>}
            onPress={()=>{}}/>
        <View>
            <Text style={{ color: Colors.white, fontSize: 16, textAlign: 'center', marginTop: 10 }}>
                You can add merchants from the transaction details page.
            </Text>
        </View>
    </View>
  )
}

export default addMerchant

const styles = StyleSheet.create({})