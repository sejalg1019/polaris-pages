import React, {Component} from 'react';
import { Image } from 'react-native';
import RecScreen from '../screens/RecScreen';
import TrackingScreen from '../screens/TrackingScreen';
import {createBottomTabNavigator} from 'react-navigation-tabs';

export const AppTabNavigator = createBottomTabNavigator({
  Rec: {
    screen: RecScreen, 
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/recommend.png")} style={{width:30, height:30}}/>,
      tabBarLabel : "Recommendations",
    }
  },
  Tracking: {
    screen: TrackingScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/progress.png")} style={{width:30, height:30}}/>,
      tabBarLabel : "Progress",
    } 
  }
})