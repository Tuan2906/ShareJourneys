import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
// import color from '/style/color';
const color= {
    white: "#FFFFFF",
    black: "#222222",
    primary: "#007260",
    secondary: "#39B68D",
    grey: "#CCCCCC"
}

const Button = (props) => {
    const filledBgColor = props.color || color.primary;
    const outlinedColor = color.white;
    const bgColor = props.filled ? filledBgColor : outlinedColor;
    const textColor = props.filled ? color.white : color.primary;

    return (
        <TouchableOpacity
            style={{
                ...styles.button,
                ...{ backgroundColor: bgColor },
                ...props.style
            }}
            onPress={props.onPress}
        >
            <Text style={{ fontSize: 18, ... { color: textColor } }}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingBottom: 16,
        paddingVertical: 10,
        borderColor: color.primary,
        borderWidth: 2,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default Button