import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { Icon } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import db from '../config';
import { firebase } from '../config';

export default class TrackingScreen extends Component {
  constructor() {
    super();

    this.state = {
      books: [],

      modalVisible: false,

      title: '',
      author: '',
      totalPages: '',
      currentPage: '',
      editingBook: null,
      editCurrentPage: '',
    };
  }

  addBook = async () => {
    const user = firebase.auth().currentUser;

    await db
      .collection('users')
      .doc(user.uid)
      .collection('books')
      .add({
        title: this.state.title,
        author: this.state.author,

        totalPages: Number(this.state.totalPages),

        currentPage: Number(this.state.currentPage),
      });

    this.setState({
      modalVisible: false,
      title: '',
      author: '',
      totalPages: '',
      currentPage: '',
    });
  };

  openEditModal = (item) => {
    this.setState({
      editingBook: item,
      editCurrentPage: item.currentPage.toString(),
      modalVisible: true,
    });
  };

  updateBook = async () => {

  const user = firebase.auth().currentUser;

  await db
    .collection("users")
    .doc(user.uid)
    .collection("books")
    .doc(this.state.editingBook.id)
    .update({

      currentPage: Number(this.state.editCurrentPage)

    });

  this.setState({
    modalVisible: false,
    editingBook: null,
    editCurrentPage: ""
  });
};

  componentDidMount() {
    this.getBooks();
  }

  getBooks = () => {
    const user = firebase.auth().currentUser;

    this.unsubscribe = db
      .collection('users')
      .doc(user.uid)
      .collection('books')
      .onSnapshot((snapshot) => {
        const books = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        this.setState({
          books: books,
        });
      });
  };

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  deleteBook = async (bookId) => {
    const user = firebase.auth().currentUser;

    await db
      .collection('users')
      .doc(user.uid)
      .collection('books')
      .doc(bookId)
      .delete();
  };

  renderItem = ({ item }) => {
    const progress = item.currentPage / item.totalPages;

    return (
      <View style={styles.bookCard}>
        <TouchableOpacity onPress={() => this.openEditModal(item)}>
          <View style={styles.row}>
            <Icon name="book" type="font-awesome" color="#28385e" />

            <View style={{ marginLeft: 15 }}>
              <Text style={styles.bookTitle}>{item.title}</Text>

              <Text>by {item.author}</Text>

              <Text style={{ marginTop: 5 }}>
                {item.currentPage} / {item.totalPages} pages
              </Text>
            </View>
          </View>

          <Progress.Bar
            progress={progress}
            width={250}
            height={10}
            borderRadius={10}
            style={{ marginTop: 15 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => this.deleteBook(item.id)}>
          <Text style={{ color: 'white' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Book Tracker</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => this.setState({ modalVisible: true })}>
          <Text style={styles.addButtonText}>Add Book</Text>
        </TouchableOpacity>

        <Modal visible={this.state.modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Book</Text>

            <TextInput
              placeholder="Book Title"
              placeholderTextColor="#272927"
              style={styles.input}
              value={this.state.title}
              onChangeText={(text) => this.setState({ title: text })}
            />

            <TextInput
              placeholder="Author"
              placeholderTextColor="#272927"
              style={styles.input}
              value={this.state.author}
              onChangeText={(text) => this.setState({ author: text })}
            />

            <TextInput
              placeholder="Total Pages"
              placeholderTextColor="#272927"
              keyboardType="numeric"
              style={styles.input}
              value={this.state.totalPages}
              onChangeText={(text) => this.setState({ totalPages: text })}
            />

            <TextInput
              placeholder="Current Page"
              placeholderTextColor="#272927"
              keyboardType="numeric"
              style={styles.input}
              value={
                this.state.editingBook
                  ? this.state.editCurrentPage
                  : this.state.currentPage
              }
              onChangeText={(text) =>
                this.state.editingBook
                  ? this.setState({ editCurrentPage: text })
                  : this.setState({ currentPage: text })
              }
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={this.state.editingBook ? this.updateBook : this.addBook}>
              <Text style={styles.buttonText}>
                {this.state.editingBook ? 'Update Progress' : 'Submit'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() =>
                this.setState({
                  modalVisible: false,
                  editingBook: null,
                  editCurrentPage: '',
                })
              }>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <FlatList
          data={this.state.books}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#28385e',
    paddingTop: 50,
  },

  heading: {
    fontSize: 38,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },

  addButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: 160,
    alignSelf: 'center',
    marginBottom: 20,
  },

  addButtonText: {
    textAlign: 'center',
    color: '#28385e',
    fontWeight: 'bold',
    fontSize: 18,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  input: {
    width: '85%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },

  submitButton: {
    backgroundColor: '#28385e',
    padding: 15,
    borderRadius: 10,
    width: 220,
    marginTop: 10,
  },

  cancelButton: {
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 10,
    width: 220,
    marginTop: 10,
  },

  deleteButton: {
    backgroundColor: '#fc8b83',
    padding: 15,
    borderRadius: 10,
    width: 220,
    marginTop: 10,
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  bookCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 15,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
