import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from './api';
import Colors from '@/constants/Colors';
import PageHeader from '@/components/PageHeader';
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { toTitleCase } from '@/utils/stringUtils';
import Input from '@/components/Input';
import * as ImagePicker from 'expo-image-picker'
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/Button';
import { router } from 'expo-router';
import Loading from '@/components/Loading';

const addMerchant = () => {
    const [merchantData, setMerchantData] = useState<any[]>([]);
    const [selectedMerchant, setSelectMerchant] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [newMerchant, setNewMerchant] = useState<boolean>(false);
    const [categoryName, setCategoryName] = useState("");
    const [currentKeyWord, setCurrentKeyWord] = useState<string>("");
    const [keywords, setKeywords]  = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
            // Ask the user for permission to access the media library
           // No permissions request is necessary for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            });
    
            console.log(result);
    
            if (!result.canceled) {
            setImage(result.assets[0].uri);
            }
        };

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
    useEffect(() => {
        fetchData();
    }
    , []);

    const selectCurrentMerchant = (merchantId: string) => () => {
        if (selectedMerchant === merchantId) {
            setSelectMerchant(null);
        }else {
            setSelectMerchant(merchantId);
        }
        console.log("Selected Merchant ID:", merchantId);
    }

    const toggleMerchantNewExisting = () => {
        setNewMerchant(!newMerchant);
    }

    const attachMerchant = async () => {
        console.log("Pressed Attach Merchant")
    }

    const addNewWord = (keyword: string) => () => {
        console.log("Pressed Add New Word:", keyword);
        if (keyword.trim() === "") {
            console.log("Keyword is empty, not adding.");
            return;
        }

        if (keywords.includes(keyword)) {
            console.log("Keyword already exists, not adding.");
            return;
        }
        setKeywords([...keywords, keyword]);
    }

    const addNewMerchant = async () => {
        const formData = new FormData();
        const lowerKeywords = keywords.map((word) => word.toLowerCase());
        
        formData.append('name', categoryName.toLowerCase());
        formData.append('keywords', JSON.stringify(lowerKeywords));

        if (image) {
        const fileName = image.split('/').pop();
        const fileType = fileName?.split('.').pop();

        formData.append('icon', {
            uri: image,
            name: fileName,
            type: `image/${fileType}`,
        } as any); // `as any` to satisfy TypeScript
        }

        await api.post('/api/merchants/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        }).then( (res) => {
            console.log("Response", res.data);
            Alert.alert("Merchant Category", `Merchant category created`, [
                { text : "OK",
                    onPress: () => {
                        setLoading(false);
                        router.push('/transactions')}
                }
                
            ]);
            setCategoryName("");
            setImage(null);
        }).catch((error) => {
            let message = error.response.data.name[0]
            console.log(message)
            Alert.alert('Failed to Create Merchant.',message[0].toUpperCase() + message.slice(1))
        })   
    }
    
  return (
    <ProtectedRoute>
        { loading ? (
            <Loading/>
        ) :
        
        <View style={{ flex: 1, backgroundColor: Colors.black}}>
            <PageHeader
                title="Add Merchant" />
            { !newMerchant ? (

            <View style={styles.container}> 
                <Text style={styles.pageTitleTxt}>Attach a Merchant</Text>
                <Text style={styles.pageTxt}>Let's tag a merchant to this <Text style={{ fontWeight: 600 }}>transactions</Text>.</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={styles.pageSubTitleTxt}>Exisiting Merchant</Text>
                    <Button style={styles.toggleNewMerchantBtn} onPress={toggleMerchantNewExisting}>
                        <Text style={{color : Colors.white}}>Add New Merchant</Text>
                    </Button>
                </View>
                <View style={styles.containerExistingMerchant}>
                    {
                        merchantData.length > 0 ? (
                            merchantData.map((merchant: any) => (
                                <TouchableOpacity key={merchant.id} style={ 
                                    selectedMerchant === merchant.id ? styles.containerExistingMerchantItem2 : styles.containerExistingMerchantItem
                                } onPress={selectCurrentMerchant(merchant.id)}>
                                    <Image
                                        source={{
                                            uri: merchant.icon ? merchant.icon.replace('/media', '/api/media') : '',
                                        }}
                                        style={{ width: 50, height: 50, borderRadius: 25, marginBottom: 5 }}/>
                                    <Text style={{ color: Colors.white, fontSize: 16 }}>{toTitleCase(merchant.name)}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={{ color: Colors.white }}>No merchants found.</Text>
                        )
                    }
                </View>
                <Button onPress={attachMerchant} disabled={merchantData.length === 0 || selectedMerchant === null}> 
                    <Text style={{color : Colors.white}}>Attach Merchant</Text>
                </Button>
            </View>
            ) : (
            <View style={styles.container}>
                <Text style={styles.pageTitleTxt}>Attach a Merchant</Text>
                <Text style={styles.pageTxt}>Let's tag a merchant to this <Text style={{ fontWeight: 600 }}>transactions</Text>.</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={styles.pageSubTitleTxt}>Add New Merchant</Text>
                    <Button style={styles.toggleNewMerchantBtn} onPress={toggleMerchantNewExisting}>
                        <Text style={{color : Colors.white}}>Existing Merchant</Text>
                    </Button>
                </View>
                <View style={{ gap: 20 }}>
                    <View>
                        <Text style={styles.groupHeaderTxt}>Merchant Name</Text>
                        <Input 
                            placeholder="Enter merchant name" 
                            onChangeText={(value) => {setCategoryName(value)}}
                            iconLeft={<MaterialIcons name='storefront' size={24} color={Colors.white}/>}
                        />
                    </View>
                    <View style={{ gap: 5 }}>
                        <Text style={styles.groupHeaderTxt}>Tag Keyword</Text>
                        <Input 
                            placeholder="Enter keywords (optional)" 
                            onChangeText={(value) => {setCurrentKeyWord(value)}}
                            iconLeft={<MaterialIcons name='abc' size={24} color={Colors.white}/>}
                            iconRight={<AntDesign name='plus' size={22} color={Colors.white}/>}
                            onPress = {addNewWord(currentKeyWord)}
                        />
                        {
                            keywords.length > 0 ? (
                                <FlatList 
                                    data={keywords} 
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={{ 
                                            backgroundColor: Colors.neutral700, 
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            padding: 10, 
                                            borderRadius: 8, 
                                            marginVertical: 5,
                                            gap: 2
                                        }} onPress={() => {
                                            setKeywords(keywords.filter((word) => word !== item));
                                        }}>
                                            <Text style={{ color: Colors.white }}>{item}</Text>
                                            <Entypo name="cross" size={16} color={Colors.white} />
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item) => item}
                                    horizontal
                                    ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
                                    showsHorizontalScrollIndicator={false}
                                />
                            ) : null
                        }
                        <Text style={styles.descriptionTxt}>
                            Keyword are use to auto attach transactions with this words or phrase to this merchant.
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.groupHeaderTxt}>Merchant Icon</Text>
                        <TouchableOpacity onPress={()=>{pickImage()}} style={{ 
                            width: 100,
                            height: 100,
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            borderRadius: 10, 
                            borderWidth: 0.7,
                            borderColor: Colors.white,
                            borderStyle: 'dashed',
                            backgroundColor: Colors.grey}}>  
                            { image ? (
                                <Image source={{ uri: image }} style={{ width: '100%', height: '100%', borderRadius: 10 }}/>
                            ): 
                                <MaterialCommunityIcons name='file-image-plus' size={36} color={Colors.white}/>
                            }
                        </TouchableOpacity>                           
                    </View>
                </View>
                <Button onPress={addNewMerchant}> 
                    <Text style={{color : Colors.white}}>Add Merchant</Text>
                </Button>
            </View>
            )}
        </View>
        }
    </ProtectedRoute>
  )
}

export default addMerchant

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
        paddingHorizontal: 20,
        gap: 16,
    },
    containerExistingMerchant: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
    }, 
    containerExistingMerchantItem: {
        justifyContent:'center',
        alignItems:'center', 
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        borderColor: Colors.neutral700
    },
    containerExistingMerchantItem2: {
        justifyContent:'center',
        alignItems:'center', 
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: Colors.neutral400,
        borderWidth: 1,
        padding: 10,
        borderColor: Colors.neutral700
    },
    groupHeaderTxt: {
            color: Colors.white,
            fontSize: 14,
            paddingBottom: 8,
            fontWeight: 600
        },
    pageTitleTxt : {
            fontSize: 24,
            color: Colors.white,
            fontWeight: 700
        },
    pageSubTitleTxt : {
        fontSize: 18,
        color: Colors.white,
        fontWeight: 700
    },
    pageTxt : {
        color: Colors.white,
        fontSize: 12,
        marginBottom: 10,
    },
    descriptionTxt: {
        color: Colors.white,
        fontSize: 12,
        marginTop: 5,
        marginBottom: 10,
    },
    toggleNewMerchantBtn: {
        width : 150, 
        height: 30, 
        alignSelf: 'flex-end', 
        borderRadius: 8, 
        backgroundColor: Colors.neutral800
    }
})