import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import TouchableItem from '../TouchableItem';

export default class HeaderGoBack extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableItem
          rounded
          style={styles.wrapper}
          onPress={() => this.props.navigation.goBack()}
        >
          <FontAwesome5 name="angle-left" size={32} color="#333" />
        </TouchableItem>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 8
  },

  wrapper: {
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
