import React from "react";
import { View, TextInput, Animated } from "react-native";

export default class Input extends React.Component {
  state = {
    isFocused: false
  };

  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(
      this.props.value === "" ? 0 : 1
    );
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.value !== "" ? 1 : 0,
      duration: 200
    }).start();
  }

  setInputRef = ref => {
    this.inputRef = ref;

    const { getRef } = this.props;

    if (getRef) {
      getRef(ref);
    }
  };

  render() {
    const { label, nextField, ...props } = this.props;
    const labelStyle = {
      position: "absolute",
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0]
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 14]
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ["#aaa", "#000"]
      })
    };

    return (
      <View style={{ paddingTop: 18 }}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          {...props}
          style={{
            height: 26,
            fontSize: 20,
            color: `${ this.props.editable === false ? "#BBB" : "#000" }`,
            borderBottomWidth: 1,
            borderBottomColor: "#555",
            marginVertical: 16
          }}
          ref={this.setInputRef}
          onSubmitEditing={() => nextField && nextField.focus()}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
        />
      </View>
    );
  }
}
