
import React from 'react';
import {
  Button,
  Image,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar
} from 'react-native';
import PropTypes from 'prop-types';
import { MemoryRouter, Route, Redirect } from 'react-router-native';

import UserService from './services/user-service';
import Logo from './components/logo';

import Home from './components/home';
import SignIn from './components/sign-in';
import SignUp from './components/sign-up';

import Config from './config';


class PrivateRoute extends React.Component {
  static contextTypes = {
    userService: PropTypes.instanceOf(UserService).isRequired
  };

  render() {
    const { userService } = this.context;
    const { component: Component, ...rest } = this.props;

    return (
      <Route {...rest} render={props => (
        userService.user ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{
            pathname: '/signup',
            state: { animated: false, next: props.location }
          }}/>
        )
      )}/>
    );
  }
}


export default class Application extends React.Component {
  static childContextTypes = {
    userService: PropTypes.instanceOf(UserService).isRequired
  };

  constructor() {
    super();
    this.state = {
      splash: true
    };
    this.userService = new UserService();
  }

  getChildContext() {
    return {
      userService: this.userService
    };
  }

  componentWillMount() {
    Promise.all([
      this.userService.getUser().catch(() => {})
    ]).then(() => this.setState({ splash: false }));
  }

  componentWillUnmount() {

  }

  render() {
    const { splash } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#17aaff"
          barStyle="light-content"/>
        {splash && <Logo style={[StyleSheet.absoluteFill, styles.splash]}/>}
        {!splash && <View style={[StyleSheet.absoluteFill, { paddingTop: Platform.OS === 'web' ? 0 : 20 }]}>
          <PrivateRoute exact path="/" component={Home}/>
          <Route exact path="/signin" component={SignIn}/>
          <Route exact path="/signup" component={SignUp}/>
        </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: Config.backgroundColor
  },
  splash: {
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth: 0
  }
});



AppRegistry.registerComponent('<%= projectName %>', () => () => <MemoryRouter><Application/></MemoryRouter>)

if (Platform.OS === 'web') {
  AppRegistry.runApplication('<%= projectName %>', {
    rootTag: document.getElementById('react-root')
  });
}
