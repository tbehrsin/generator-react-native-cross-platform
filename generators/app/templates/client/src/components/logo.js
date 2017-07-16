
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';

import Config from '../config';
import logoImage from '../images/company-logo.png';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Config.backgroundColor,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: Config.borderColor
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8
  },
  text: {
    color: 'white',
    fontSize: 24
  },
  companyFont: {

  },
  boldFont: {
    fontWeight: '600'
  }
});

export default class Logo extends React.Component {
  render() {
    const { style } = this.props;

    return (
      <View style={[styles.container, style]}>
        <Image source={logoImage} style={styles.logo}/>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            <Text style={styles.companyFont}><Text style={styles.boldFont}><%= company %></Text></Text>
          </Text>
        </View>
      </View>
    );
  }
}
