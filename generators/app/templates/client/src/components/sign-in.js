
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TextInput
} from 'react-native';
import PropTypes from 'prop-types';
import UserService from '../services/user-service';
import Form from './form';

const styles = StyleSheet.create({

});

export default class SignIn extends React.Component {
  static contextTypes = {
    userService: PropTypes.instanceOf(UserService).isRequired
  };

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: null
    };
  }

  onPressSignIn = async () => {
    const { userService } = this.context;
    const { email, password } = this.state;

    try {
      this.setState({ error: null });
      await userService.authenticate(email, password);
      this.props.history.replace(this.props.location.state.next, { animated: 'slide-up' });
    } catch(err) {
      this.setState({ error: err.message });
      return;
    }
  };

  onPressSignUp = () => {
    const { next } = this.props.location.state || {};

    this.props.history.replace('/signup', { animated: 'slide-right', next });
  };

  onChangeEmail = (email) => {
    email = email.trim().replace(/\s+/, '');
    this.setState({ email });
  };

  onChangePassword = (password) => {
    this.setState({ password });
  };

  render() {
    const  { email, password, error } = this.state;
    return (
      <Form
        error={error}
        fields={{
          email: {
            value: email,
            placeholder: 'Email',
            onChangeText: this.onChangeEmail,
            autoCapitalize: 'none',
            autoCorrect: false,
            keyboardType: 'email-address'
          },
          password: {
            value: password,
            placeholder: 'Password',
            onChangeText: this.onChangePassword,
            autoCapitalize: 'none',
            autoCorrect: false,
            keyboardType: 'default',
            secureTextEntry: true
          }
        }}
        buttonTitle="Sign In"
        onSubmit={this.onPressSignIn}
        footer={{
          signIn: {
            text: 'Not got an account?',
            title: 'Sign up',
            onPress: this.onPressSignUp
          }
        }}/>
    );
  }
}
