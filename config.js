import firebase from 'firebase';

require('firebase/firestore');
require('firebase/auth');

const firebaseConfig = {
  apiKey: 'AIzaSyBciu2pJpDCgzW489a7s2QLanSghk5MLA4',
  authDomain: 'beingwell-2cbbb.firebaseapp.com',
  projectId: 'beingwell-2cbbb',
  storageBucket: 'beingwell-2cbbb.appspot.com',
  messagingSenderId: '156625470497',
  appId: '1:156625470497:web:3f0082bda8bdf5560a4f60',
};


if (!firebase.apps.length) {

  firebase.initializeApp(firebaseConfig);

}

const db = firebase.firestore();

export { firebase };

export default db;