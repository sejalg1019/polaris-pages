import './patchDimensions';
import React from 'react';
import { Stylesheet, Text, View } from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen';
import RecommendationScreen from './screens/RecommendationScreen'
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppTabNavigator } from './components/AppTabNavigator';

export default function App() {
  return <AppContainer />;
}

const switchNavigator = createSwitchNavigator({
  WelcomeScreen: { screen: WelcomeScreen },
  BottomTab: { screen: AppTabNavigator },
  Recommendations: {screen: RecommendationScreen}
});

const AppContainer = createAppContainer(switchNavigator);
