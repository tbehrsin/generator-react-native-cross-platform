
import React from 'react';

import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback
} from 'react-native';

export default class Button extends React.Component {
  constructor() {
    super();
    this.state = {
      pressed: false
    };
  }

  onPressIn = () => {
    this.setState({ pressed: true });
  }

  onPressOut = () => {
    this.setState({ pressed: false });
  }

  render() {
    const { style, activeStyle, textStyle, textActiveStyle, onPress } = this.props;
    const { pressed } = this.state;

    return (
      <TouchableWithoutFeedback
        onPress={onPress}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}>
        <View style={[style, pressed ? activeStyle : null]}>
          <Text style={[textStyle, pressed ? textActiveStyle : null]}>{this.props.children}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
};
