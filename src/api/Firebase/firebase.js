import firebase from "firebase";
import firebaseConfig from "./firebase.config";
import _ from "lodash";

firebase.initializeApp(firebaseConfig);

const isObject = obj => {
  return Object.prototype.toString.call(obj) === "[object Object]"
    ? true
    : false;
};

const toArray = snap => {
  const array = [];

  snap.forEach(child => {
    const val = child.val();
    if (isObject(val)) {
      val.key = child.key;
    }
    array.push(val);
  });

  return array;
};

const Firebase = {
  loginWithEmail: (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  },

  signupWithEmail: (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  },

  signOut: () => {
    return firebase.auth().signOut();
  },

  checkUserAuth: user => {
    return firebase.auth().onAuthStateChanged(user);
  },

  passwordReset: email => {
    return firebase.auth().sendPasswordResetEmail(email);
  },

  currentUser: () => firebase.auth().currentUser,

  saveUserInfo: data => {
    return firebase
      .database()
      .ref("users/")
      .push(data);
  },

  getUserInfo: async id => {
    const query = firebase
      .database()
      .ref("users")
      .orderByChild("id")
      .equalTo(id);

    const snapshot = await query.once("value");

    return toArray(snapshot);
  },

  updateUserInfo: async (id, data) => {
    const query = firebase
      .database()
      .ref("users")
      .orderByChild("id")
      .equalTo(id);

    return query.once("child_added", (snapshot) => {
      snapshot.ref.update(data)
    });
  },

  addFavorite: data => {
    return firebase
      .database()
      .ref("favorites")
      .push(data);
  },

  removeFavorite: id => {
    try {
      const query = firebase.database().ref("favorites").orderByChild("id").equalTo(id);

      return query.once("child_added", (snapshot) => {
        snapshot.ref.remove()
      });
    } catch(err) {
      console.log('ERROR: ', err);
    }
  },

  getFavorites: async () => {
    const query = firebase
      .database()
      .ref("favorites")

    const snapshot = await query.once("value");

    return toArray(snapshot);
  },

  createArticle: data => {
    return firebase
      .database()
      .ref("articles")
      .push(data);
  },

  getArticles: async () => {
    const query = firebase
      .database()
      .ref("articles")

    const snapshot = await query.once("value");

    return toArray(snapshot);
  },

  getArticleById: async id => {
    const query = firebase
      .database()
      .ref("articles")
      .orderByChild("id")
      .equalTo(id);

    const snapshot = await query.once("value");

    return toArray(snapshot);
  },
};

export default Firebase;
