
import {
  AsyncStorage
} from 'react-native';
import { EventEmitter } from 'events';

import Config from '../config';

export default class UserService extends EventEmitter {
  async create(name, email, password) {
    const response = await fetch(`${Config.URL_PREFIX}/user/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });
    if(!response.ok) {
      throw new Error("The supplied email address is already registered.");
    }
    const user = await response.json();
    await AsyncStorage.setItem('@<%= projectName %>:accessToken', JSON.stringify(user.accessToken));
    delete user.accessToken;
    this.user = user;
    this.emit('update', user);
    return user;
  }

  async authenticate(email, password) {
    const response = await fetch(`${Config.URL_PREFIX}/user/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    if(!response.ok) {
      throw new Error("Email and password combination not known");
    }
    const user = await response.json();
    await AsyncStorage.setItem('@<%= projectName %>:accessToken', JSON.stringify(user.accessToken));
    delete user.accessToken;
    this.user = user;
    this.emit('update', user);
    return user;
  }

  async signOut() {
    this.user.pushToken = null;
    await this.putUser(this.user);
    delete this.user;
    await AsyncStorage.removeItem('@<%= projectName %>:accessToken');
    this.emit('update', null);
  }

  async getAccessToken() {
    const accessToken = JSON.parse(await AsyncStorage.getItem('@<%= projectName %>:accessToken'));
    return accessToken;
  }

  async getUser() {
    if(this.user) {
      return this.user;
    }

    const accessToken = await this.getAccessToken();
    const response = await fetch(`${Config.URL_PREFIX}/user/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const user = await response.json();
    this.user = user;
    this.emit('update', user);
    return user;
  }

  async putUser(user) {
    const accessToken = await this.getAccessToken();
    const response = await fetch(`${Config.URL_PREFIX}/user/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(user)
    });
    const updatedUser = await response.json();
    this.user = updatedUser;
    this.emit('update', updatedUser);
    return updatedUser;
  }
};
