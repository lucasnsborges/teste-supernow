import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions
} from "react-native";

const { width, height } = Dimensions.get("window");

export default class Loader extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.shadow} />
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color="#333" />
          <Text style={styles.text}>Loading</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  shadow: {
    position: "absolute",
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: "black",
    width: width,
    height: height,
    zIndex: 1
  },

  loaderWrapper: {
    width: width - 32,
    height: 68,
    borderRadius: 4,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    zIndex: 2
  },

  text: {
    marginHorizontal: 32
  }
});
