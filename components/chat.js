import React from "react";
import { StyleSheet, View, Text, Button, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');


class Chat extends React.Component {

    constructor() {
        super();
        this.state = {
            messages: [],
            loggedInText: 'Please wait until you are logged in',
            uid: 0
        }

        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyAHk6btELvaiNCSjeuEUCxJUQaBCPoTpSs",
                authDomain: "chatapp-f8893.firebaseapp.com",
                projectId: "chatapp-f8893",
                storageBucket: "chatapp-f8893.appspot.com",
                messagingSenderId: "952846402386",
                appId: "1:952846402386:web:2075f4aad2329b17f2f08b"
              });
        }
        //this references a specific collection from firebase
        this.referenceChatMessages = firebase.firestore().collection('messages');
    };


    onSend(messages = []) { //the paramter is the object array from the state
        //paramter 'previousState' is a reference to the component's state at the time the change is applied
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
            //this appends the new message to the messages object with append()
            //the first parameter in append() is the old state, while second is the new.
        }),
        () => {this.addMessage();}
        )
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


    //this function retrieves the curent data in your collection and store it in my 'lists' state
    onCollectionUpdate = (querySnapshot) => {
        let name = this.props.route.params.name;
        let messages = [];
        //go through each document; querySnapshot is all the data currently in my collection
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            messages.push({ //each field is saved into the lists object
                uid: data._id,
                text: data.text,
                name: name,
            });
        });
        this.setState({ //the fields are saved and rendered by the setState() function
            messages
        })
    }

    addMessage() {
        let name = this.props.route.params.name;
        this.referenceChatMessages.add({
            uid: this.state.uid,
            name: name,
            text: 'test message'
        })
    }


    componentDidMount() {
        let name = this.props.route.params.name;
        this.referenceChatMessages = firebase.firestore().collection('messages');

        //authorizing specific user
        //firebase.auth().onAuthStateChanged is what calls the firebase auth service
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                await firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user.uid,
                loggedInText: 'Hello there ' + name,
                user: {
                    _id: user.uid,
                    name: name,
                    avatar: 'https://placeimg.com/140/140/any',
                },
            });
            //this references the specific user messages by uid within specific collection 
            // this.referenceChatMessageUser = firebase.firestore().collection('messages').where("uid", "==", this.state.uid);
            // this.unsubscribeChatMessageUser = this.referenceChatMessageUser.onSnapshot(this.onCollectionUpdate);
            //snapshot function returns how the data looks in the present time
        })
        this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate);
    }


    componentWillUnmount() {
        // this.authUnsubscribe();
        // this.unsubscribeChatMessageUser();
        this.unsubscribe();
    }


    render() {
        let backgroundColor = this.props.route.params.backgroundColor;

        return (
            <View style={[styles.container, { backgroundColor: backgroundColor }]}>
                {/* provide the component with the messages state, info about the user(_id) and function. */}
                <Text>{this.state.loggedInText}</Text>
                <GiftedChat
                    accessible={true}
                    accessibilityLabel='chat text input'
                    accessibilityHint='This is where you type your messages and are able read your responses from other users'
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 2
                    }}
                />
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>
        )
    }
}

export default Chat

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});