import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { CustomIconButtonProps } from '@/types'
import { TouchableOpacity } from 'react-native'
import Colors from '@/constants/Colors'
import Loading from './Loading'

const CustomIconButton = ({
    style,
    onPress,
    icon,
    loading = false,
    text,
    focusable,
    focused = false, // add this
 }: CustomIconButtonProps) => {
    if(loading) {
        return (
            <View style={[styles.button, style, {backgroundColor: 'transparent'}]}>
                <Loading/>
            </View>
        );
    }

    return (
        <TouchableOpacity
            style={[
                styles.button,
                style,
                {
                    borderColor: focused ? Colors.white : '#666',
                    backgroundColor: focused ? '#524d41' : 'transparent',
                },
            ]}
            onPress={onPress}
        >
            {icon}
            <Text
                style={{
                    marginLeft: 10,
                    color: Colors.white,
                    fontSize: 14,
                }}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
};




export default CustomIconButton

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        padding: 10,
        flexDirection: 'row',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        width: 'auto'
    }
});