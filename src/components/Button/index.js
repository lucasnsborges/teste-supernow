import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default class Button extends React.Component {
  static defaultProps = {
    fillColor: "#333"
  };

  render() {
    const { fillColor, textContent } = this.props;

    return (
      <TouchableOpacity
        onPress={() => this.props.onPress()}
        style={[styles.button, { backgroundColor: fillColor }]}
      >
        <Text style={styles.buttonText}>{textContent}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    borderRadius: 54,
    marginVertical: 4,
    alignItems: "center",
    justifyContent: "center"
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold"
  }
});
