import React from "react";
import { StyleSheet, View, Text, Button, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from "@react-native-community/netinfo";

let firebase = require('firebase');
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
            },
            isConnected: false,
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


//turned everything into an arrow function

componentDidMount() {
        let name = this.props.route.params.name;

        //this statement will use firestore if the user is online or async with the getMessages() if not
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                this.setState({
                    isConnected: true
                });

                //this references a specific collection from firebase
                this.referenceChatMessages = firebase.default.firestore().collection("messages");
                // listens for updates in the collection
                this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);

                //authorizing specific user
                //firebase.auth().onAuthStateChanged is what calls the firebase auth service
                this.authUnsubscribe = firebase.default.auth().onAuthStateChanged(async (user) => {
                    if (!user) {
                        await firebase.default.auth().signInAnonymously();
                    }
                    let userInfo = {
                        _id: user.uid,
                        name: name,
                        avatar: "https://placeimg.com/140/140/any",
                    };
                    //update user state with currently active user data
                    this.setState({
                        uid: user.uid,
                        loggedInText: 'Hello there ' + name,
                        messages: [],
                        user: userInfo
                    });
                    await AsyncStorage.setItem('user', JSON.stringify(userInfo));
                    //this references the specific user messages by uid within specific collection
                    //the function below matches the message with the uid in the user object, to only show messag
                    this.unsubscribeChatMessageUser = firebase.default.firestore().collection("messages").where("uid", "==", this.state.uid);
                    //snapshot function returns how the data looks in the present time
                });
                console.log('online');
                this.saveMessages();
            } else {
                this.getMessages();
                console.log('offline');
            }
        });
    }


    componentWillUnmount() {
        this.authUnsubscribe();
        this.unsubscribeChatMessageUser();
        this.unsubscribe();
    }


    //this function retrieves the curent data in your collection and store it in my 'lists' state
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        //go through each document; querySnapshot is all the data currently in my collection
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            messages.push({
                _id: data._id,
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
        this.saveMessages(messages);
    };


    onSend = (messages = []) => {
        // this.setState(previousState => ({
        //     messages: GiftedChat.append(previousState.messages, messages),
        // }), () => {
            this.addMessages(messages[0]);
        // })
    }


    addMessages = (message) => {
        // add a new messages to the collection
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt,
            user: this.state.user
        });
    }


    saveMessages = async(messages) => { //this stores the message data;
        try {
            //using JSON.stringify to convert the saved messages object into a string to be stored; entries in data base are strings
            await AsyncStorage.setItem('messages', JSON.stringify(messages));
        } catch (error) {
            console.log(error.message)
        }
    }


    getMessages = async() => { //this reads and returns the message date
        try { //async requires a try and catch
            //getItem is used to read data
            let messages = await AsyncStorage.getItem('messages') || [];
            let user = await AsyncStorage.getItem('user') || [];
            console.log(messages)
            this.setState({
                //using JSON.parse to convert the saved messages string into an object; messages are displayed as whole objects
                messages: JSON.parse(messages),
                user: JSON.parse(user)
            });
        } catch (error) {
            console.log(error.message)
        }
    }


    deleteMessages = async() => {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.messages)
        }
    }


    renderBubble = (props) => {//render buuble prop is a built in prop from gifted chat.
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: 'mediumslateblue'
                    },
                    right: {
                        backgroundColor: 'dodgerblue'
                    }
                }}
            />
        )
    }


    renderInputToolbar = (props) => {
		if (this.state.isConnected == false) {
            return (
                <View>
                    <Text>Sorry, You are offline</Text>
                </View>
            )
		} else {
			return <InputToolbar {...props} />;
		}
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
                    renderInputToolbar={this.renderInputToolbar}
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