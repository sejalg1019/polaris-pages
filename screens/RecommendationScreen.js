import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

export default class RecommendationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recommendations: [],
    };
  }

  componentDidMount() {
    const recommendations =
      this.props.navigation.state.params?.recommendations || [];

    console.log('RECEIVED SCREEN PARAMS:', recommendations);

    this.setState({ recommendations });
  }

  renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>

        {item.genre && <Text style={styles.meta}>Genre: {item.genre}</Text>}
        {item.pages && <Text style={styles.meta}>Pages: {item.pages}</Text>}
        {item.year && <Text style={styles.meta}>Year: {item.year}</Text>}

        <Text style={styles.score}>Score: {item.score}</Text>

        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Your Recommendations</Text>

        {this.state.recommendations.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No recommendations found</Text>
            <Text style={styles.emptySubText}>
              Try adjusting your preferences
            </Text>
          </View>
        ) : (
          <FlatList
            data={this.state.recommendations}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
          />
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate('Rec')}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#28385e',
    paddingTop: 50
  },

  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20
  },

  card: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28385e'
  },

  author: {
    fontSize: 16,
    marginTop: 3,
    fontStyle: 'italic'
  },

  meta: {
    fontSize: 14,
    marginTop: 4
  },

  score: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#2e7d32'
  },

  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20
  },

  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  },

  emptyText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold'
  },

  emptySubText: {
    color: 'white',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center'
  },

  button: {
    backgroundColor: 'white',
    margin: 20,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center'
  },

  buttonText: {
    color: '#28385e',
    fontWeight: 'bold'
  }

});
