import React from 'react';
import {StyleSheet, View, Text, Button, TextInput, ImageBackground, Pressable} from 'react-native';


export default class Start extends React.Component {

    constructor(props){
        super(props);
        this.state={
            name: '',
            backgroundColor: ''
        }
    }

    onPressHandler = () => {
        this.props.navigation.navigate('Chat')
        //this.props.navigation is used to navigate to different screens in the stack as every screen is assigned a navigation property as a prop.
        this.props.navigation.navigate('Chat', { 
            name: this.state.name,
            backgroundColor: this.state.backgroundColor
         }) //adds the data to the transitioning screen
    }

    onChangeHandler = (newName) => { //paramter is passed into become the new value of the state of 'name'
        this.setState({ name: newName })
      }
    

    render() {
        return (
                <ImageBackground source={require('../assets/backgroundImage.png')} style={styles.container}>
                    <Text style={styles.title}>Chat App</Text>
                    <TextInput 
                        style={styles.textInput}
                        onChangeText={this.onChangeHandler}
                        placeholder='Enter Name'
                    />
                    <View>
                        <Text style={styles.text}>Select a Background Color</Text>
                        <View style={styles.colorRow}>
                            <Pressable 
                                style={styles.color1}
                                onPress={() => this.setState({ backgroundColor: '#f0f8ff'})}//passing the object value to replace the state value
                            />
                            <Pressable 
                                style={styles.color2}
                                onPress={() => this.setState({ backgroundColor: '#ffe4e1'})}
                            />
                            <Pressable 
                                style={styles.color3}
                                onPress={() => this.setState({ backgroundColor: 'orange'})}
                            />
                            <Pressable 
                                style={styles.color4}
                                onPress={() => this.setState({ backgroundColor: '#eee8aa'})}
                            />
                        </View>
                    </View>
                    <Button 
                        title='Start Chatting'
                        onPress={this.onPressHandler}
                    />
                </ImageBackground>
        )
    }
}

let styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'blue',
      opacity: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 45,
      fontWeight: '600',
      color: '#FFFFFF'
    },
    textInput: {
      height: 40,
      borderColor: 'white',
      borderWidth: 1,
      width: 200,
      marginBottom: 30, 
      color: 'white'
    },
    colorRow: {
        flex: .5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    color1: {
        width: 40,
        height: 40,
        backgroundColor: '#f0f8ff',
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'black',
        marginBottom: 30
    },
    color2: {
        width: 40,
        height: 40,
        backgroundColor: '#ffe4e1',
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'black',
        marginBottom: 30
    },
    color3: {
        width: 40,
        height: 40,
        backgroundColor: 'orange',
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'black',
        marginBottom: 30
    },
    color4: {
        width: 40,
        height: 40,
        backgroundColor: '#eee8aa',
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'black',
        marginBottom: 30
    },
    text: {
        color: 'white'
    }
  });