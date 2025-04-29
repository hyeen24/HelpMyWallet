import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Colors from '@/constants/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import Input from '@/components/Input'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import Button from '@/components/Button'
import { isLoaded } from 'expo-font'

const addCategory = () => {
    const [categoryName, setCategoryName] = useState("");
  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.pageTitleTxt}>Add New Category</Text>
        <Text style={styles.pageTxt}>Add new category for your <Text style={{ fontWeight: 600 }}>expenses</Text>.</Text>
        <View>
            <Text style={styles.groupHeaderTxt}>Category Name</Text>
            <Input 
            placeholder="Enter category" 
            onChangeText={(value) => {setCategoryName(value)}}
            icon={<MaterialIcons name='category' size={26}
            color={Colors.white}/>}
            />
        </View>
        <View>
        <Text style={styles.groupHeaderTxt}>Category Icon</Text>
        </View>
        <View>
            <Text style={styles.groupHeaderTxt}>Category Color</Text>
            
        </View>  
        <Button>
                <Text style={styles.groupHeaderTxt}>Add</Text>
        </Button>
    </SafeAreaView>
  )
}

export default addCategory

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
        gap : 10,
        backgroundColor: Colors.black,
        paddingHorizontal: 10
      },
    pageTitleTxt : {
        fontSize: 24,
        color: Colors.white,
        fontWeight: 700
    },
    groupHeaderTxt: {
        color: Colors.white,
        fontSize: 16,
        paddingBottom: 8,
        fontWeight: 400
    },
    pageTxt : {
        color: Colors.white,
        fontSize: 12
    },
    footer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
      },
})