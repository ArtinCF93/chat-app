import React from "react";
import { StyleSheet, View, Text, Button, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');


class Chat extends React.Component {

    constructor() {
        super();
        this.state = {
            loggedInText: 'Please wait until you are logged in',
            messages: [],
            uid: 0,
            user: {
                _id: "",
                name: "",
                avatar: "",
              }
        }

        if (!firebase.default.apps.length) { //firebase integration
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


    onSend(messages = []) {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
          this.addMessages();
        })
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
        const messages = [];
        //go through each document; querySnapshot is all the data currently in my collection
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            messages.push({
                uid: data.uid,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar
                  },
            });
        });
        this.setState({
            messages: messages
        });
    };


    addMessages() {
        let message = this.state.messages[0];
        // add a new messages to the collection
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt,
            user: this.state.user
        });
    }


    componentDidMount() {
        let name = this.props.route.params.name;

        //this references a specific collection from firebase
        this.referenceChatMessages = firebase.default.firestore().collection("messages");
        // listens for updates in the collection
        this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate)

        //authorizing specific user
        //firebase.auth().onAuthStateChanged is what calls the firebase auth service
        this.authUnsubscribe = firebase.default.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                return await firebase.default.auth().signInAnonymously();
            }
            //update user state with currently active user data
            this.setState({
                uid: user.uid,
                loggedInText: 'Hello there ' + name,
                messages: [],
                user: {
                    _id: user.uid,
                    name: name,
                    avatar: "https://placeimg.com/140/140/any",
                  },
            });
            //this references the specific user messages by uid within specific collection
            //the function below matches the message with the uid in the user object, to only show messag
            this.unsubscribeChatMessageUser = firebase.default.firestore().collection("messages").where("uid", "==", this.state.uid);
            //snapshot function returns how the data looks in the present time
        });
    }


    componentWillUnmount() {
        this.authUnsubscribe();
        this.unsubscribeChatMessageUser();
        this.unsubscribe();
    }


    render() {
        let backgroundColor = this.props.route.params.backgroundColor;
        let name = this.props.route.params.name;

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
                        _id: this.state.user._id, //this saves user as an object in database {}
                        // storing the uid in the user object in giftedchat to be refferred to in using the referenceChatMessageUser function in component did mount
                        name: name,
                        avatar: this.state.user.avatar,
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