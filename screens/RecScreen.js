import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';

import firebase from 'firebase';
import db from '../config';

export default class RecScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser?.email,
      genre: '',
      length: '',
      year: '',
      request: '',
      loading: false,
    };
  }

  findRec = async () => {
    try {
      this.setState({ loading: true });

      const snapshot = await db.collection('books').get();

      const books = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const recommendations = this.scoreBooks(books);

      console.log('ALL SCORED BOOKS:', recommendations);

      this.setState({ loading: false });

      this.props.navigation.navigate('Recommendations', {
        recommendations: recommendations || [],
      });
    } catch (error) {
      console.log('ERROR fetching books:', error);
      this.setState({ loading: false });
      alert('Failed to load books. Check Firebase permissions or data.');
    }
  };

  scoreBooks = (books) => {
    const genreInput = (this.state.genre || '').toLowerCase().trim();
    const requestInput = (this.state.request || '').toLowerCase().trim();

    const keywords = requestInput.split(' ').filter(Boolean);

    return books
      .map((book) => {
        let score = 0;

        const genre = (book.genre || '').toLowerCase();
        const title = (book.title || '').toLowerCase();
        const description = (book.description || '').toLowerCase();
        const tags = Array.isArray(book.tags)
          ? book.tags.map((t) => t.toLowerCase())
          : [];

        if (genreInput && genre.includes(genreInput)) {
          score += 10;
        }

        if (genreInput && genreInput.includes(genre)) {
          score += 8;
        }

        if (book.pages && this.state.length) {
          if (Number(book.pages) <= Number(this.state.length)) {
            score += 3;
          }
        }

        if (book.year && this.state.year) {
          if (Number(book.year) >= Number(this.state.year)) {
            score += 3;
          }
        }

        keywords.forEach((word) => {
          if (title.includes(word)) score += 5;
          if (description.includes(word)) score += 2;

          tags.forEach((tag) => {
            if (tag.includes(word)) score += 3;
          });
        });

        return {
          ...book,
          score,
        };
      })
      .filter((book) => book.score >= 10)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.heading}>Find Your Next Book</Text>

            {this.state.loading && (
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  marginTop: 10,
                }}>
                Finding best matches...
              </Text>
            )}

            <View style={styles.inputText}>
              <TextInput
                style={styles.inputBox}
                placeholder="Genre"
                placeholderTextColor="#272927"
                onChangeText={(text) => this.setState({ genre: text })}
              />

              <TextInput
                style={styles.inputBox}
                placeholder="Max Pages"
                placeholderTextColor="#272927"
                keyboardType="numeric"
                onChangeText={(text) => this.setState({ length: text })}
              />

              <TextInput
                style={styles.inputBox}
                placeholder="Earliest Year"
                placeholderTextColor="#272927"
                keyboardType="numeric"
                onChangeText={(text) => this.setState({ year: text })}
              />

              <TextInput
                style={[styles.inputBox, { height: 120 }]}
                multiline
                placeholder="Specific Requests"
                placeholderTextColor="#272927"
                onChangeText={(text) => this.setState({ request: text })}
              />

              <TouchableOpacity style={styles.button} onPress={this.findRec}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#28385e',
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    margin: 60,
  },
  inputText: {
    flex: 1,
    alignItems: 'center',
  },
  inputBox: {
    width: 250,
    height: 40,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'white',
    fontSize: 20,
    margin: 10,
    paddingLeft: 10,
  },
  button: {
    width: '60%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
  },
});
