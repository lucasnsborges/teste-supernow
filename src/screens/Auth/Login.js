import React from "react";
import { StyleSheet, SafeAreaView, View, Text, Alert } from "react-native";

import Input from "../../components/Input";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import TouchableItem from "../../components/TouchableItem";

import { withFirebaseHOC } from "../../api/Firebase";

class Login extends React.Component {
  state = {
    isLoading: false,
    email: "",
    password: ""
  };

  handleSubmit = async () => {
    this.setState({
      isLoading: true
    });

    const { email, password } = this.state;

    try {
      const response = await this.props.firebase.loginWithEmail(
        email,
        password
      );

      if (response) this.props.navigation.navigate("App");
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

  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={[styles.bold, styles.font24]}>
            Que bom te ver por aqui!
          </Text>
        </View>

        <View style={{ flex: 2 }}>
          <Input
            autoCapitalize="none"
            autoCompleteType="email"
            keyboardType="email-address"
            label="E-mail"
            value={this.state.email}
            onChangeText={value => this.setState({ email: value })}
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
            textContent="Entrar"
            fillColor="#707070"
            onPress={this.handleSubmit}
          />
          <Button
            textContent="Continuar com Facebook"
            fillColor="#bbbbbb"
            onPress={() => console.log("login com facebook")}
          />
          <TouchableItem
            style={{ height: 54, justifyContent: "center" }}
            onPress={() => this.props.navigation.navigate("Signup")}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
                textDecorationLine: "underline"
              }}
            >
              Não tenho uma conta
            </Text>
          </TouchableItem>
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

  alignCenter: {
    alignItems: "center"
  }
});

export default withFirebaseHOC(Login);
