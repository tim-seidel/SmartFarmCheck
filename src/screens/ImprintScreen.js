import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const ImprintScreen = (props) => {

    return (
        <View style={styles.container}>
            <Text>Imprint</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
})

export default ImprintScreen;