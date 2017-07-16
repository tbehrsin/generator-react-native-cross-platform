
import React from 'react';
import {
  Button,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import md5 from 'md5';
import UserService from '../services/user-service';
import Config from '../config';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  body: {
    paddingHorizontal: 25
  },
  logo: {
    height: 135,
    paddingLeft: 30
  },
  header: {
    marginBottom: 40
  },
  headerTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#95989a'
  },
  headerTitleButton: {
    color: Config.backgroundColor,
    fontSize: 15
  },
  bodySection: {
    marginBottom: 42
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileImageContainer: {
    marginRight: 20
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36
  },
  profileName: {
    fontSize: 18,
    fontWeight: '900',
    color: 'black',
    marginVertical: 3
  },
  profileEmail: {
    fontSize: 15,
    fontWeight: '400',
    color: 'black',
    marginVertical: 3
  }
});

export default class Settings extends React.Component {

  static contextTypes = {
    userService: PropTypes.instanceOf(UserService).isRequired,
    router: PropTypes.object.isRequired
  };

  onPressSignOut = () => {
    const { userService, timeService } = this.context;
    const { history } = this.context.router;

    userService.signOut();
    history.replace('/signin', { next: '/' });
  };

  render() {
    const { userService } = this.context;

    const emailHash = md5(userService.user.email.toLowerCase());
    const avatar = `https://www.gravatar.com/avatar/${emailHash}?s=512&d=mm`;

    return (
      <View style={styles.container}>
        <View style={[styles.container, styles.body]}>
          <View style={styles.bodySection}>
            <View style={styles.headerTitle}>
              <Text style={styles.headerTitleText}>PROFILE</Text>
              <TouchableOpacity onPress={this.onPressSignOut}>
                <View>
                  <Text style={styles.headerTitleButton}>Sign out</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.profileContainer}>
              <View style={styles.profileImageContainer}>
                <Image resizeMode="contain" source={{uri: avatar}} style={styles.profileImage}/>
              </View>
              <View style={styles.profileNameContainer}>
                <Text style={styles.profileName}>{userService.user.name}</Text>
                <Text style={styles.profileEmail}>{userService.user.email}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
