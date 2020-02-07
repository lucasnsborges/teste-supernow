import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'uuid';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

import { withFirebaseHOC } from "../../api/Firebase";

import Avatar from "../../components/Avatar";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import HeaderGoBack from "../../components/HeaderGoBack";

const PLACEHOLDER_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

class Profile extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      uploadLoading: false,
      fullname: "",
      firstName: "",
      email: "",
      lastName: "",
      profileImage: ""
    };
  }

  async componentDidMount() {
    const { firebase } = this.props;

    const user = firebase.currentUser();
    const info = await firebase.getUserInfo(user.uid)

    this.setState({
      email: user.email,
      firstName: info[0].firstName,
      lastName: info[0].lastName,
      profileImage: info[0].profileImage,
      fullname: `${info[0].firstName} ${info[0].lastName}`
    })
  }

  async uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const ref = firebase
      .storage()
      .ref()
      .child(uuid.v4());
    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  handleUpdateProfileImage = async () => {
    this.setState({
      uploadLoading: true
    });

    const image = await ImagePicker.launchImageLibraryAsync();
    const upload = await this.uploadImageAsync(image.uri);
    const user = await this.props.firebase.currentUser();
    const update_info = await this.props.firebase.updateUserInfo(user.uid, { profileImage: upload });

    if (update_info) {
      this.setState({ profileImage: upload, uploadLoading: false });
    }
  }

  handleSubmit = async () => {
    this.setState({ isLoading: true })

    const { firstName, lastName } = this.state;

    const user = await this.props.firebase.currentUser();
    const update_info = await this.props.firebase.updateUserInfo(user.uid, {
      firstName,
      lastName
    });

    if (update_info) {
      this.setState({
        isLoading: false,
        fullname: `${firstName} ${lastName}`
      })
    }

    Alert.alert(
      "Perfil atualizado",
      "Suas informações foram salvas com sucesso",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  }

  handleSignOut = async () => {
    await this.props.firebase.signOut();

    this.props.navigation.navigate("Auth");
  }


  render() {
    const { fullname, profileImage, isLoading, uploadLoading } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    return (
      <View style={styles.container}>
        <HeaderGoBack navigation={this.props.navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <HideWithKeyboard style={styles.headerContainer}>
            <Avatar
              size={124}
              letter={fullname.slice(0, 1)}
              source={{ uri: profileImage || PLACEHOLDER_IMAGE }}
              isLoading={uploadLoading}
            />
            <Text style={styles.name}>{fullname}</Text>
            <TouchableOpacity onPress={this.handleUpdateProfileImage}>
              <Text style={styles.textUnderline}>
                trocar foto
              </Text>
            </TouchableOpacity>
          </HideWithKeyboard>

          <View style={{ flex: 1, padding: 16 }}>
            <Input
              label="Nome"
              value={this.state.firstName}
              onChangeText={value => this.setState({ firstName: value })}
              returnKeyType={"next"}
              nextField={this.state.lastNameRef}
            />
            <Input
              label="Sobrenome"
              value={this.state.lastName}
              onChangeText={value => this.setState({ lastName: value })}
              getRef={ref => this.setState({ lastNameRef: ref })}
              returnKeyType={"next"}
              nextField={this.state.emailRef}
            />
            <Input
              autoCapitalize="none"
              label="E-mail"
              editable={false}
              value={this.state.email}
              onChangeText={value => this.setState({ email: value })}
              getRef={ref => this.setState({ emailRef: ref })}
            />
            <View style={{ margin: 16, paddingHorizontal: 64 }}>
              <Button
                textContent="Salvar"
                fillColor="#707070"
                onPress={this.handleSubmit}
              />
              <TouchableOpacity style={{ marginTop: 16 }} onPress={() => this.handleSignOut()}>
                <Text style={styles.textUnderline}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const fontColorSecondary = "#555";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },

  headerContainer: {
    height: 300,
    alignItems: "center",
    justifyContent: "center"
  },

  textUnderline: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline"
  },

  name: {
    color: fontColorSecondary,
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16
  }
});

export default withFirebaseHOC(Profile);
