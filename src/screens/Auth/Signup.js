import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Alert,
  TouchableOpacity
} from "react-native";

import HideWithKeyboard from 'react-native-hide-with-keyboard';
import Input from "../../components/Input";
import Button from "../../components/Button";
import Loader from "../../components/Loader";

import { withFirebaseHOC } from "../../api/Firebase";

class Signup extends React.Component {
  state = {
    isLoading: false,
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  };

  handleSubmit = async () => {
    this.setState({
      isLoading: true
    });

    const { email, password, firstName, lastName } = this.state;

    try {
      const response = await this.props.firebase.signupWithEmail(
        email,
        password
      );

      if(response) {
        const user = await this.props.firebase.currentUser();

        return this.props.firebase.saveUserInfo({
          id: user.uid,
          firstName,
          lastName
        });
      }
    } catch (error) {
      Alert.alert(
        "Ops!",
        error.message,
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      );

      this.setState({
        isLoading: false
      });
    }
  };

  onChangeText = () => {};

  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    return (
      <SafeAreaView style={styles.container}>
        <HideWithKeyboard style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={[styles.bold, styles.font24]}>Crie sua conta</Text>
        </HideWithKeyboard>

        <View style={{ flex: 2 }}>
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
            autoCompleteType="email"
            keyboardType="email-address"
            label="E-mail"
            value={this.state.email}
            onChangeText={value => this.setState({ email: value })}
            getRef={ref => this.setState({ emailRef: ref })}
            returnKeyType={"next"}
            nextField={this.state.passwordRef}
          />
          <Input
            autoCapitalize="none"
            label="Senha"
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={value => this.setState({ password: value })}
            getRef={ref => this.setState({ passwordRef: ref })}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Button
            textContent="Cadastrar"
            fillColor="#707070"
            onPress={this.handleSubmit}
          />
          <Button
            textContent="Continuar com Facebook"
            fillColor="#bbbbbb"
            onPress={() => console.log("login com facebook")}
          />
          <TouchableOpacity
            style={{ height: 54, justifyContent: "center" }}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            <Text style={styles.textUnderline}>Já tenho uma conta</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
    padding: 32
  },

  font24: {
    fontSize: 24
  },

  bold: {
    fontWeight: "bold"
  },

  textUnderline: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline"
  }
});

export default withFirebaseHOC(Signup);
