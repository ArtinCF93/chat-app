import React from "react";
import {StyleSheet, View, Text, Button} from 'react-native';
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

export default class Chat extends React.Component {

    onPressHandler = () => {
        this.props.navigation.navigate('Start')
    }

    render() {
        let name = this.props.route.params.name;
        let backgroundColor = this.props.route.params.backgroundColor;
        

        this.props.navigation.setOptions({
            title: name //this makes the title of the screen the name entered
        }) 

        return (
            <View style={[styles.container, {backgroundColor: backgroundColor}]}>
                <Text>Hello Screen2!</Text>
                <Button 
                    title='Go to Screen1'
                    onPress={this.onPressHandler}
                />
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center', 
        justifyContent:'center', 
        backgroundColor: 'white'
    }
  });