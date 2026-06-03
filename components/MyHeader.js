import React, { Component} from 'react';
import { Header, Icon, Badge } from 'react-native-elements';
import { View, Text, StyleSheet, Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';

const MyHeader = props => {
  return(
        <Header
      centerComponent={{ text: this.props.title, style: { color: '#516c8d', fontSize:20,fontWeight:"bold", } }}
  />
  )
}