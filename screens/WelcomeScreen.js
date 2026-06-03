import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  Modal,
  Alert,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import firebase from 'firebase';
import db from '../config';

export default class WelcomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: '',
      password: '',
      isModalVisible: 'false',
      firstName: '',
      lastName: '',
      confirmPassword: '',
    };
  }

  userSignUp = (emailId, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return Alert.alert('Your password does not match, please try again!');
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(emailId, password)
        .then(() => {
          const user = firebase.auth().currentUser;

          db.collection('users').doc(user.uid).set({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            email_id: this.state.emailId,
          });
          return Alert.alert('User Added Successfully', '', [
            {
              text: 'OK',
              onPress: () => this.setState({ isModalVisible: false }),
            },
          ]);
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorMessage);
        });
    }
  };

  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}>
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: '100%' }}>
            <KeyboardAvoidingView style={styles.keyboardAV}>
              <Text style={styles.modalTitle}> Sign Up </Text>

              <TextInput
                style={styles.formInput}
                placeholder={'First Name'}
                placeholderTextColor="#272927"
                maxLength={10}
                onChangeText={(text) => {
                  this.setState({
                    firstName: text,
                  });
                }}
              />

              <TextInput
                style={styles.formInput}
                placeholder={'Last Name'}
                placeholderTextColor="#272927"
                maxLength={10}
                onChangeText={(text) => {
                  this.setState({
                    lastName: text,
                  });
                }}
              />

              <TextInput
                style={styles.formInput}
                placeholder={'Email'}
                placeholderTextColor="#272927"
                keyboardType={'email-address'}
                onChangeText={(text) => {
                  this.setState({
                    emailId: text,
                  });
                }}
              />

              <TextInput
                style={styles.formInput}
                placeholder={'Password'}
                placeholderTextColor="#272927"
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
              />

              <TextInput
                style={styles.formInput}
                placeholder={'Confirm Password'}
                placeholderTextColor="#272927"
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    confirmPassword: text,
                  });
                }}
              />

              <View style={styles.buttonView}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.userSignUp(
                      this.state.emailId,
                      this.state.password,
                      this.state.confirmPassword
                    );
                  }}>
                  <Text style={styles.buttonText}> Register </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.setState({
                      isModalVisible: false,
                    });
                  }}>
                  <Text style={styles.buttonText}> Cancel </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  userLogin = (emailId, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailId, password)
      .then(() => {
        this.props.navigation.navigate('Rec');
      })

      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.showModal()}
        <View>
          <Text style={styles.heading}>PolarisPages</Text>
        </View>
        <View style={styles.inputText}>
          <TextInput
            style={styles.loginBox}
            placeholder="abc@123.com"
            placeholderTextColor="gray"
            keyboardType="email-address"
            onChangeText={(text) => {
              this.setState({
                emailId: text,
              });
            }}
          />

          <TextInput
            style={styles.loginBox}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="gray"
            onChangeText={(text) => {
              this.setState({
                password: text,
              });
            }}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.userLogin(this.state.emailId, this.state.password);
            }}>
            <Text style={styles.buttonText}> Login </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({
                isModalVisible: true,
              });
            }}>
            <Text style={styles.buttonText}> Sign Up </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#28385e',
  },
  loginBox: {
    width: 250,
    height: 40,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'white',
    fontSize: 20,
    margin: 10,
    color: 'black',
  },
  inputText: {
    flex: 1,
    alignItems: 'center',
    color: 'black',
  },
  heading: {
    fontSize: 60,
    fontWeight: 'bold',
    bottomPadding: 40,
    color: 'white',
    margin: 40,
    marginTop: 100,
  },
  button: {
    width: 125,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#ffff',
    shadowColor: '#000',
    marginTop: 10,
    marginBottom: 25,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16,
  },
  buttonText: {
    color: '#28385e',
    fontWeight: '200',
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#516c8d',
    margin: 30,
  },
  keyboardAV: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    bottomPadding: 40,
    color: 'white',
    margin: 40,
  },
  formInput: {
    width: 250,
    height: 40,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'white',
    fontSize: 20,
    margin: 10,
    marginBottom: 15,
    color: 'black',
  },
  buttonView: {
    flex: 0.2,
    alignItems: 'center',
  }
});
