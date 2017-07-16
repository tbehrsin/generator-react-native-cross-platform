
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';
import Logo from './logo';
import Profile from './profile';
import UserService from '../services/user-service';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingLeft: 25,
    height: 120
  },
  body: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5fbff'
  }
});

export default class Home extends React.Component {

  static contextTypes = {
    userService: PropTypes.instanceOf(UserService).isRequired
  };

  componentWillMount() {
    
  }

  render() {
    const { style } = this.props;

    return (
      <View style={styles.container}>
        <Logo style={styles.header}/>
        <View style={styles.body}>
          <Profile/>
        </View>
      </View>
    );
  }
}
