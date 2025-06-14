import { Alert, Image, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import Colors from '@/constants/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageHeader from '@/components/PageHeader'
import { PageHeaderProps } from '@/types'
import Input from '@/components/Input'
import { AntDesign, Feather, FontAwesome, FontAwesome6, Foundation, MaterialCommunityIcons } from '@expo/vector-icons'
import Button from '@/components/Button'
import api from '../api'
import * as DocumentPicker from 'expo-document-picker';
import * as Updates from 'expo-updates';
import { isLoading } from 'expo-font'
import Loading from '@/components/Loading'
import { getItem } from 'expo-secure-store'

const Transactions = () => {
    const [searchTxt, setSearchTxt]  = useState("");
    const [merchantData, setMerchantData] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [fileInfo, setFileInfo] = React.useState<DocumentPicker.DocumentPickerResult | null>(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const router = useRouter();
    
    const fetchData = async () => {
            try {
                const response = await api.get("api/transactions/");
                const transactionsData = response.data
                // console.log("Transactions:", transactionsData);
                setTransactions(transactionsData)
            } catch (err) {
                console.error("API fetch error:", err);
            }

            try {
                const response = await api.get("api/merchants/");
                const merchantData = response.data
                setMerchantData(merchantData);
                // console.log("Merchant:", merchantData);
            } catch (err) {
                console.error("API fetch error:", err);
            }
        };

    useEffect(() => {   
        fetchData();
        // console.log("fileInfo:", fileInfo);
    }, []);

    const toggleModal = () => {
        setUploading(prev => !prev);
        if (uploading) {
            setFileInfo(null); // Reset file info when closing the modal
        }
    }

      const pickDocument = async () => {
        try {
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*', // or you can specify e.g. 'application/pdf'
            copyToCacheDirectory: true,
            multiple: false,
        });
        // console.log('Document result:', result);
        if (result.canceled) {
            
            console.log('Document picking cancelled');
        } else {
            console.log('Document picked:', result);
            setFileInfo(result);
        }
        } catch (error) {
        console.error('Error picking document:', error);
        }
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    const uploadFile = async () => {
        setIsLoading(true);
        const formData = new FormData();
    
        let fileName = fileInfo['assets'][0]['name']
        let fileType = fileName?.split('.').pop();
        let fileuri = fileInfo['assets'][0]['uri']

        formData.append('name', fileName);

        if (fileInfo) {
        
        formData.append('file', {
            uri: fileuri,
            name: fileName,
            type: `application/${fileType}`,
        } as any); // `as any` to satisfy TypeScript
        }

        console.log(formData)
        
        await api.post('/api/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            }).then((res) => {  
                Alert.alert("Bank Statement Uploaded.", `Transaction extracted from bank statement`, [
                                        { text : "OK", onPress: () => onRefresh() }
                                    ]);
                setIsLoading(false);
            }).catch((err) => {
                const errorData =err.response.data;
                console.log(errorData);

            });
    }
     const selectTransaction = (
        merchantIcon : string,
        merchantName: string,
        merchantId: string,
        itemAmount : string,
        itemDescription: string,
        transactionDate: string,
    ) =>{
        router.push({
            pathname: '/transactionDetails',
            params: {
                merchantIcon,
                merchantName,
                merchantId,
                itemAmount,
                itemDescription,
                transactionDate
            }
        });
    }

  return (
    <View style={{flex: 1 , backgroundColor: Colors.black}}>    
       <Stack.Screen
        options={{headerShown: true,
          header: () => (<PageHeader title="My Transactions" rightButton={
            <MaterialCommunityIcons name='file-plus-outline' size={22} color={Colors.white}/>
            }
            onPress={toggleModal}/>),
            headerTransparent: true
            
        }}
        />
        <View style={styles.container}>
            <Modal
            animationType="slide"
            transparent={true}
            visible={uploading}
            onRequestClose={toggleModal}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <Text style={styles.modalText}>Upload Your Statement</Text>
                { fileInfo ? (
                    <View style={{ 
                        width: 150,
                        height: 50,
                        backgroundColor: Colors.neutral300, 
                        justifyContent:'center', 
                        alignItems: 'center', 
                        borderRadius :10, 
                        borderWidth:1, 
                        borderStyle:'dashed'}}>
                        <Text style={{color: Colors.black}}>{fileInfo.assets[0].name}</Text>
                    </View>
                ): (
                     <TouchableOpacity style={{ 
                    width: 150,
                    height: 100,
                    backgroundColor: Colors.neutral300, 
                    justifyContent:'center', 
                    alignItems: 'center', 
                    borderRadius :10, 
                    borderWidth:1, 
                    borderStyle:'dashed'}} onPress={pickDocument}>
                    <MaterialCommunityIcons name='file-upload-outline' size={50} color={Colors.black} />
                </TouchableOpacity>
                )
                
            }
                <View style={{ flexDirection:'row', gap: 10 }}>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={toggleModal}>
                        <Text style={styles.textStyle}>Cancel</Text>
                    </Pressable>
                    {
                        fileInfo ? (
                            <Pressable
                                style={[styles.button, styles.buttonUpload]}
                                onPress={uploadFile}>
                                <Text style={styles.textStyle}>Upload</Text>
                            </Pressable>
                        ) : null
                    }
                    
                </View>
                </View>
            </View>
            </Modal>
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
                <View style={{ flexDirection: 'row', marginHorizontal: 5, gap:5, justifyContent:'center'}}>
                    <FontAwesome name='calendar' size={20} color={Colors.white} />
                    <Text style={{color: Colors.white}}>Sort By: Date</Text>
                    <AntDesign name='down' size={20} color={Colors.white} />
                </View>
            </View>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                {
                    transactions&& transactions.length > 0 ? (
                transactions.map((item) => {
                    // console.log("merchantData:", merchantData);
                    // console.log("Matching Merchant:",matchedMerchant.icon);
                    const merchant = item.merchant ? merchantData.find(m => m.id === item.merchant) : null;
                    // console.log(merchant)

                    return(
                    <TouchableOpacity key={item.ref_number} style={styles.itemContainer} onPress={() => selectTransaction(
                        merchant?.icon ?? '',
                        merchant?.name ?? 'Unknown',
                        merchant?.id ?? '',
                        item.amount,
                        item.description,
                        item.trans_date
                    )}>
                    
                            <View style={styles.iconContainer}>
                                { merchant && merchant.icon ? (
                                    <Image
                                        source={{ uri: merchant.icon.replace('/media','/api/media') }}
                                        style={{ width: 50, height: 50, borderRadius: 10 }}/>
                                    
                                    ) : (
                                        <Foundation name="dollar" size={22} color={Colors.white}/>
                                    )   
                                }
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <View style={{ gap: 5 }}>
                                    <Text style={[styles.spendingTxt, { fontWeight: 700 }]}>{item.description}</Text>
                                    <Text style={styles.spendingTxt}>{item.trans_date}</Text>
                                </View>
                                <Text style={[styles.spendingTxt, { fontWeight: 700 }]}>${item.amount}</Text>
                            </View>
                    </TouchableOpacity>  
                    );
                })): (
                    <View style={{ gap : 20}}>
                        <View style={{ marginTop: 20, alignItems : 'center', backgroundColor: Colors.grey, height: 50, justifyContent:'center', borderRadius:20}}>
                            <Text style={{ fontSize: 14, color: Colors.white}}>No transaction record.</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

        </View>
    </View>
    )
}

export default Transactions

const styles = StyleSheet.create({
    container: {
           backgroundColor:Colors.black,
           gap: 16,
           paddingTop: 100,
           marginHorizontal:16,
       },
    text: {
        color: Colors.white

    },
    spendingTxt : {
        color: Colors.white
    },
    iconContainer : {
        width:50, 
        height:50, 
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
        borderRadius: 15,
        backgroundColor: Colors.grey, 
        height: 70,
        paddingHorizontal: 10,},
        centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
  modalView: {
    backgroundColor: Colors.neutral200,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    marginTop: 10,
    backgroundColor: '#f04a4a',
  },
  buttonUpload: {
    marginTop: 10,
    backgroundColor: Colors.tintColor,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontWeight : 400,
    marginBottom: 15,
    textAlign: 'center',
  },
})