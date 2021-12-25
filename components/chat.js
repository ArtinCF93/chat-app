import React from "react";
import {StyleSheet, View, Text, Button, Platform, KeyboardAvoidingView} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';

export default class Chat extends React.Component {

    constructor(){
        super();
        this.state={
            messages: []
        }
    }

    onSend(messages=[]) { //the paramter is the object array from the state
        //paramter 'previousState' is a reference to the component's state at the time the change is applied
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
            //this appends the new message to the messages object with append()
            //the first parameter in append() is the old state, while second is the new.
        }))
    }

    renderBubble(props) {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                  backgroundColor: 'purple'
              },
              right: {
                backgroundColor: 'lawngreen'
              }
            }}
          />
        )
      }


    componentDidMount() {
        let name = this.props.route.params.name;

        this.setState({
            messages: [
                { //this is the message attribute and content
                    _id: 1, //each message requires an id, a creation date and a user object
                    text: 'Hello Developer',
                    createdAt: new Date(),
                    user: { //this is he user attribute of the person sending the message
                        _id: 2, //the user object requires a user id, name and avatar
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/any'
                    }
                    //you can also add images below the user attribute.
                },
                {
                    _id: 2,
                    text: name + ', get started by sending a message',
                    createdAt: new Date(),
                    system: true,
                }
            ]
        })
    }

    render() {
        let backgroundColor = this.props.route.params.backgroundColor;

        return (
            <View style={[styles.container, {backgroundColor: backgroundColor}]}>
            {/* provide the component with the messages state, info about the user(_id) and function. */}
                <GiftedChat
                    accessible = {true}
                    accessibilityLabel = 'chat text input'
                    accessibilityHint = 'This is where you type your messages and are able read your responses from other users' 
                    renderBubble={this.renderBubble.bind(this)}
                    messages = {this.state.messages}
                    onSend={messages => this.onSend(messages)} 
                    user={{
                        _id: 2
                    }}
                />
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
  });