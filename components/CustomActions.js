import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location';
import PropTypes from 'prop-types';
//with PropTypes, you can define what the props you send to a component should look like. 

let firebase = require('firebase');
require('firebase/firestore');



export default class CustomActions extends React.Component {

  uploadImageFetch = async (uri) => {
    let blob = await new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    let imageNameBefore = uri.split("/");
    let imageName = imageNameBefore[imageNameBefore.length - 1];

    let ref = firebase.default.storage().ref().child(`images/${imageName}`);

    let snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };


  pickImage = async () => {
    //this first asks the user for permission for access.
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      //use ImagePicker.launchImageLibraryAsync ( a function that opens device's media library)
      let result = await ImagePicker.launchImageLibraryAsync({
        //specify the media type ex. images, videos, or all for both
        mediaTypes: 'Images',
      }).catch(error => console.log(error));

      //this sets the state of image to whatever image user chooses
      if (!result.cancelled) {
        let imageUrl = await this.uploadImageFetch(result.uri);
        this.props.onSend({ image: imageUrl });
      }
    }
  }


  takePhoto = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      //use ImagePicker.launchImageLibraryAsync ( a function that opens device's media library)
      let result = await ImagePicker.launchCameraAsync({
        //specify the media type ex. images, videos, or all for both
        mediaTypes: 'All',
      }).catch(error => console.log(error));

      //this sets the state of image to whatever image user chooses
      if (!result.cancelled) {
        let imageUrl = await this.uploadImageFetch(result.uri);
        this.props.onSend({ image: imageUrl });
      }
    }
  }


  getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status == 'granted') {
      let result = await Location.getCurrentPositionAsync({})
        .catch(error => console.log(error));
      if (result) {
        this.props.onSend({
          location: {
            longitude: result.coords.longitude,
            latitude: result.coords.latitude
          },
        });
      }
    }
  }


  onActionPress = () => {
    //options is the set of options that are displayed
    const options = ['Choose from the Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    //this.context.actionSheet().showActionSheetWithOptions is used to hand down the above 2 data (the options you want to display) to the ActionSheet component.
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0: //this case will execute when user presses the matching index in the options array above. Case 0 being index 0
            console.log('user wants to pick an image');
            return this.pickImage();
          case 1:
            console.log('user wants to take a photo');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return this.getLocation();
          default:
        }
      },
    );
  };


  render() {
    return (
      <View>
        <TouchableOpacity
          title='Customize message'
          style={styles.container}
          onPress={this.onActionPress}
        >
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
          </View>
        </TouchableOpacity >
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center'
  }
})

CustomActions.contextTypes = {
  //defining actionSheet as a function with PropTypes. 
  actionSheet: PropTypes.func
}
