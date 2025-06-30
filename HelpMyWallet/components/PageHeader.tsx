import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { use, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '@/constants/Colors'
import { toTitleCase } from '@/utils/stringUtils'
import { PageHeaderProps } from '@/types'
import BackButton from './BackButton'
import { AntDesign } from '@expo/vector-icons'
import { lightTheme, darkTheme } from '@/constants/Theme'

const PageHeader = ({
    title, 
    rightButton, 
    onPress}: PageHeaderProps) => {

    const appTheme = useColorScheme();
    const Theme = appTheme === 'dark' ? darkTheme : lightTheme;
    // console.log(Theme.cardColors)

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Theme.cardColors }]}>
        <View style={styles.leftContainer}>
            <BackButton/>
        </View>
        <View style={styles.titleContainer}>
            <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 400 }}>
                {toTitleCase(title)}
            </Text>
        </View>
        {
            rightButton ?
            <TouchableOpacity onPress={onPress} style={styles.rightContainer}>
                {rightButton}
                </TouchableOpacity>
            :<View style={{width: 36}}></View>
        }
        
    </SafeAreaView>
  )
}

export default PageHeader

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        height: 50
    },
    leftContainer : {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center', 
        paddingLeft: 10,
    },
    titleContainer : {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center', 
    },
    rightContainer : {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center', 
        paddingRight: 20,
    },
    button: {
        backgroundColor: 'transparent',
        alignSelf: 'flex-start',
        borderRadius: 25,
        borderCurve: "continuous",
        padding: 5
    }
})