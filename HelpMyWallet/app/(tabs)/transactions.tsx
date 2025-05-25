import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import Colors from '@/constants/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageHeader from '@/components/PageHeader'
import { PageHeaderProps } from '@/types'
import Input from '@/components/Input'
import { AntDesign, Feather, FontAwesome, Foundation } from '@expo/vector-icons'
import Button from '@/components/Button'
import api from '../api'
import TransactionList from '@/data/Spending.json';

const transactions = () => {
    const [searchTxt, setSearchTxt]  = useState("");
    const [merchantData, setMerchantData] = useState<any[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("api/transactions/");
                const transactionsData = response.data
                console.log("Transactions:", transactionsData);
            } catch (err) {
                console.error("API fetch error:", err);
            }

            try {
                const response = await api.get("api/merchants/");
                const merchantData = response.data
                setMerchantData(merchantData);
                console.log("Merchant:", merchantData);
            } catch (err) {
                console.error("API fetch error:", err);
            }
        };
        
        fetchData();
    }, []);

  return (
    <>    
       <Stack.Screen
        options={{
          header: () => <PageHeader title="My Transactions" />,
        }}
        />
        <View style={[styles.container, { paddingTop: 100, paddingHorizontal: 20, gap: 20}]}>
            <Input 
                placeholder="Search transactions" 
                onChangeText={(value) => {setSearchTxt(value)}}
                icon={<Feather name='search' size={26}
                color={Colors.white}/>}
            />
            <View>
                <Button style = {{width: 100, height: 30, backgroundColor: 'transparent', borderColor: Colors.white, borderWidth: 1, borderRadius: 30}}>
                    <Text style={styles.text}>Filter</Text>
                </Button>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}> 
                <Text style={{color: Colors.white}}>January 2026</Text>
                <View style={{ flexDirection: 'row', marginHorizontal: 5, gap:5}}>
                    <FontAwesome name='calendar' size={20} color={Colors.white} />
                    <Text style={{color: Colors.white}}>Sort By: Date</Text>
                    <AntDesign name='down' size={20} color={Colors.white} />
                </View>
            </View>
            <ScrollView>
                {TransactionList.map((item) => {
                    console.log("merchantData:", merchantData);
                    const matchedMerchant = merchantData.find((merchant) => 
                    item.desc.toLowerCase().includes(merchant.name.toLowerCase())
                    );

                    // console.log("Matching Merchant:",matchedMerchant.icon);
                    console.log("matchedMerchant:", matchedMerchant);

                    return(
                    <View key={item.refNumber} style={styles.itemContainer}>
                    
                            <View style={styles.iconContainer}>
                                { matchedMerchant ? (
                                    // <Image
                                    //     source={{ uri: matchedMerchant.icon }}
                                    //     style={{ width: 22, height: 22, borderRadius: 10 }}/>
                                    null
                                    ) : (
                                        <Foundation name="dollar" size={22} color={Colors.white}/>
                                    )   
                                }
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <View style={{ gap: 5 }}>
                                    <Text style={[styles.spendingTxt, { fontWeight: 700 }]}>{item.desc}</Text>
                                    <Text style={styles.spendingTxt}>{item.date}</Text>
                                </View>
                                <Text style={[styles.spendingTxt, { fontWeight: 700 }]}>${item.amount}</Text>
                            </View>
                    </View>  
                    );
                })}
            </ScrollView>

        </View>
        
    </>
    )
}

export default transactions

const styles = StyleSheet.create({
    container: {
           flex:1, 
           backgroundColor:Colors.black
       },
    text: {
        color: Colors.white

    },
    spendingTxt : {
        color: Colors.white
    },
    iconContainer : {
        width:40, 
        height:40, 
        padding: 10 , 
        borderRadius:50 ,
        marginRight: 10, 
        justifyContent:'center',
        alignItems: 'center'
    
    },
    itemContainer: { 
        flexDirection: 'row', 
        marginVertical: 3, 
        alignItems:'center', 
        backgroundColor: Colors.grey, 
        height: 70,
        paddingHorizontal: 10,}
})