import React, { Component } from "react";
import { AppLoading } from "expo";
import { withFirebaseHOC } from "../api/Firebase";

class Initial extends Component {
  state = {
    isAssetsLoadingComplete: false
  };

  componentDidMount = async () => {
    try {
      this.loadLocalAsync();

      await this.props.firebase.checkUserAuth(user => {
        if (user) {
          this.props.navigation.navigate("App");
        } else {
          this.props.navigation.navigate("Auth");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  loadLocalAsync = async () => {
    return true;
  };

  handleLoadingError = error => {
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isAssetsLoadingComplete: true });
  };

  render() {
    return (
      <AppLoading
        startAsync={this.loadLocalAsync}
        onFinish={this.handleFinishLoading}
        onError={this.handleLoadingError}
      />
    );
  }
}

export default withFirebaseHOC(Initial);
