import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import Input from './Input';
import Colors from '@/constants/Colors';
import Button from './Button';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import api from '@/app/api';


const AddNewMerchant = () => {
    const { theme } = useTheme();
    const [ categoryName, setCategoryName ] = React.useState("");
    const [ contentType, setContentType ] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [ filename, setFilename ] = useState("");
    const { user } = useAuth();
    const [ loading, setLoading ] = useState(false);


    const pickImage = async () => {
    // Ask the user for permission to access the media library
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setFilename(result.assets[0].fileName ?? "")
      console.log(result.assets[0].mimeType)
    }
  };

  const addNewMerchant = async () => {
        const formData = new FormData();
        
        formData.append('name', categoryName.toLowerCase());
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
            Alert.alert('Failed to Create Merchant.',error.response.data[0])
        })   
    }


  return (
    
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
          <View>
            <Text style={styles.pageTitleTxt}>Add a New Merchant</Text>
            <Text style={[styles.pageTxt, {marginLeft: 20, color:theme.textColor}]}>Let's add a new merchant to your <Text style={{ fontWeight: 600 }}>account</Text>.</Text>
          </View>
          <View style={ {gap: 16}}>
            <View>
                <Text style={[styles.groupHeaderTxt, {color: theme.textColor}]}>Merchant Name</Text>
                <Input 
                    placeholder="Enter merchant name" 
                    onChangeText={(value) => {setCategoryName(value)}}
                    iconLeft={<MaterialIcons name='storefront' size={24} color={Colors.white}/>}
                />
            </View>
              {/* <View style={{ gap: 5 }}>
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
              </View> */}
            <View>
              <Text style={[styles.groupHeaderTxt, {color: theme.textColor}]}>Merchant Icon</Text>
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
              
  )
}

export default AddNewMerchant

const styles = StyleSheet.create({
  container: {
        flex: 1,
        gap: 16,
      },
  groupHeaderTxt: {
      fontSize: 14,
      paddingBottom: 8,
      fontWeight: 600,
    },
  pageTitleTxt : {
          fontSize: 24,
          color: Colors.white,
          fontWeight: 700
      },
  pageSubTitleTxt : {
    fontSize: 18,
    fontWeight: 700
  },
  pageTxt : {
      fontSize: 12,
  },
})