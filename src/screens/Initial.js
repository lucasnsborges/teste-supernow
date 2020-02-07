import React, { Component } from "react";
import { AppLoading } from "expo";
import { withFirebaseHOC } from "../api/Firebase";

class Initial extends Component {
  state = {
    isAssetsLoadingComplete: false
  };

  componentDidMount = async () => {
    try {
      // previously
      this.loadLocalAsync();

      await this.props.firebase.checkUserAuth(user => {
        if (user) {
          //console.log(user);
          this.props.navigation.navigate("App");
        } else {
          //console.log("signup");
          this.props.navigation.navigate("Auth");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  loadLocalAsync = async () => {
    // return await Promise.all([
    //   Asset.loadAsync([
    //     require("../assets/flame.png"),
    //     require("../assets/icon.png")
    //   ]),
    //   Font.loadAsync({
    //     ...Icon.Ionicons.font
    //   })
    // ]);

    return true;
  };

  handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
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
