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

        if (!firebase.default.apps.length) {
            firebase.default.initializeApp({
                apiKey: "AIzaSyAHk6btELvaiNCSjeuEUCxJUQaBCPoTpSs",
                authDomain: "chatapp-f8893.firebaseapp.com",
                projectId: "chatapp-f8893",
                storageBucket: "chatapp-f8893.appspot.com",
                messagingSenderId: "952846402386",
                appId: "1:952846402386:web:2075f4aad2329b17f2f08b"
            });
        }
        this.referenceChatMessageUser = null;
    };


    onSend(messages = []) { //the paramter is the object array from the state
        this.addMessage(messages[0]);
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
        let messages = [];
        //go through each document; querySnapshot is all the data currently in my collection
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            messages.push({ //each field is saved into the lists object
                ...data,
                createdAt: data.createdAt.toDate(),
            });
        });
        this.setState({ //the fields are saved and rendered by the setState() function
            messages
        })
    }

    addMessage(message) {
        this.referenceChatMessages.add(
            message
        )
    }


    componentDidMount() {
        let name = this.props.route.params.name;

        //this references a specific collection from firebase
        this.referenceChatMessages = firebase.default.firestore().collection('messages');

        //authorizing specific user
        //firebase.auth().onAuthStateChanged is what calls the firebase auth service
        this.authUnsubscribe = firebase.default.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                await firebase.default.auth().signInAnonymously();
            }
            this.setState({
                loggedInText: 'Hello there ' + name,
                uid: user.uid
            });
            //this references the specific user messages by uid within specific collection
            //the function below matches the message with the uid in the user object, to only show messag
            this.referenceChatMessageUser = firebase.default.firestore().collection('messages').where("user", "==", this.state.uid);
            this.unsubscribeChatMessageUser = this.referenceChatMessageUser.onSnapshot(this.onCollectionUpdate);
            //snapshot function returns how the data looks in the present time
        })
    }


    componentWillUnmount() {
        this.authUnsubscribe();
        this.unsubscribeChatMessageUser();
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
                    user={
                        this.state.uid //this saves user as an object in database {}
                        // storing the uid in the user object in giftedchat to be refferred to in using the referenceChatMessageUser function in component did mount
                    }
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