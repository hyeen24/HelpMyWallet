import { StyleSheet, View, Text, TextInput } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { InputProps } from '@/types'

const Input = (props: InputProps) => {
  return (
    <View style={[styles.container, props.containerStyle && props.containerStyle]}>
        {
            props.icon && props.icon
        }
      <TextInput
        style={[styles.input,
            props.inputStyle
        ]}
        placeholderTextColor={Colors.white}
        ref={props.inputRef && props.inputRef}
        {...props}/>
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#666',
        borderRadius : 50,
        borderCurve : "continuous",
        paddingHorizontal: 15,
        gap: 10
    },
    input : {
        flex:1,
        color: Colors.white,
        fontSize: 14
    }
});