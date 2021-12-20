import React from 'react';

import 'react-native-gesture-handler';

// Wrap your application in NavigationContainer component in order for react-navigation to work
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'; //this creates the actual navigation

import Start from './components/start';
import Chat from './components/chat';

//this references the library and creates the fucntion of the 
let NavStack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <NavStack.Navigator //NavStack references the let NavStack = createStackNavigator(); at the top
        initialRouteName='Start'
        //InitialRouteName names the first screen to display by default
      >
        {/* every screen that we configure automtically gets a navigation property on the props assigned to it; props.navigation */}
        <NavStack.Screen
          name='Start'
          component={Start}
        />
        <NavStack.Screen
          name='Chat'
          component={Chat}
        />
      </NavStack.Navigator>
    </NavigationContainer>
  );
}
