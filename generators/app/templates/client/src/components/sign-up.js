
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput
} from 'react-native';
import PropTypes from 'prop-types';
import UserService from '../services/user-service';
import Form from './form';

const styles = StyleSheet.create({

});

export default class SignUp extends React.Component {
  static contextTypes = {
    userService: PropTypes.instanceOf(UserService).isRequired
  };

  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      error: null
    };
  }

  onPressSignUp = async () => {
    const { userService } = this.context;
    const { name, email, password } = this.state;

    try {
      const user = await userService.create(name, email, password);
      this.props.history.replace(this.props.location.state.next);
    } catch(err) {
      this.setState({ error: err.message });
    }
  };

  onPressSignIn = async () => {
    const { next } = this.props.location.state;
    this.props.history.replace('/signin', { animated: 'slide-left', next });
  };

  onChangeName = (name) => {
    name = name.replace(/\s+/g, ' ').replace(/^\s*/, '');
    this.setState({ name });
  };

  onChangeEmail = (email) => {
    email = email.trim().replace(/\s+/, '');
    this.setState({ email });
  };

  onChangePassword = (password) => {
    this.setState({ password });
  };

  render() {
    const  { name, email, password, error } = this.state;
    return (
      <Form
        error={error}
        fields={{
          name: {
            value: name,
            placeholder: 'Name',
            onChangeText: this.onChangeName,
            autoCapitalize: 'words',
            autoCorrect: false,
            keyboardType: 'default'
          },
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
        buttonTitle="Sign Up"
        onSubmit={this.onPressSignUp}
        footer={{
          signIn: {
            text: 'Already have an account?',
            title: 'Sign in',
            onPress: this.onPressSignIn
          }
        }}/>
    );
  }
}
