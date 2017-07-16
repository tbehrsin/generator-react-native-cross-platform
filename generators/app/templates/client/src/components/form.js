
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput
} from 'react-native';
import PropTypes from 'prop-types';
import Button from './button';
import Logo from './logo';
import Config from '../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  header: {
    paddingLeft: 25,
    height: 120
  },
  body: {
    paddingTop: 40,
    padding: 30,
    backgroundColor: '#f5fbff'
  },
  textInputContainer: {
    backgroundColor: 'white',
    borderColor: '#95989A',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  textInput: {
    height: 16,
    color: 'black',
    fontSize: 16,
    fontWeight: '400'
  },
  button: {
    backgroundColor: Config.backgroundColor,
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowColor: 'black',
    shadowRadius: 0,
    shadowOpacity: 0.7
  },
  buttonActive: {
    shadowOpacity: 0,
    top: 1,
    opacity: 0.7
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    /*textShadowOffset: {
      width: 0,
      height: 1
    },
    textShadowColor: 'black',
    textShadowOpacity: 0.4,*/
    fontSize: 16
  },
  buttonTextActive: {

  },
  footerContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-end',
    marginBottom: 50
  },
  footerContainerText: {
    color: '#95989a',
    fontWeight: '400'
  },
  footer: {

  },
  footerActive: {

  },
  footerText: {
    color: '#285d81',
    fontWeight: '400'
  },
  footerTextActive: {
    opacity: 0.7
  },
  errorContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#a78888',
    backgroundColor: '#ffe5e5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20
  },
  errorText: {
    fontSize: 15,
    fontWeight: '400',
    color: 'black'
  }
});

export default class Form extends React.Component {
  constructor() {
    super();
  }

  onSubmitEditing = (name) => {
    const { fields, onSubmit } = this.props;

    let isNext = false;
    for(const nextName in fields) {
      if(isNext) {
        this.refs[nextName].focus();
        return;
      }

      if(nextName === name) {
        isNext = true;

      }
    }

    onSubmit();
  };

  renderField(name, field) {
    const { fields } = this.props;
    const isFirst = Object.keys(fields).shift() === name;
    const isLast = Object.keys(fields).pop() === name;

    return (
      <View key={name} style={styles.textInputContainer}>
        <TextInput
          ref={name}
          autoFocus={isFirst}
          returnKeyType={isLast ? 'next' : 'done'}
          onSubmitEditing={() => this.onSubmitEditing(name)}
          style={styles.textInput}
          {...field}/>
      </View>
    );
  }

  renderFooter(name, footer) {
    return (
      <View key={name} style={styles.footerContainer}>
        <Text style={styles.footerContainerText}>{footer.text} </Text>
        <Button
          style={styles.footer}
          activeStyle={styles.footerActive}
          textStyle={styles.footerText}
          textActiveStyle={styles.footerTextActive}
          onPress={footer.onPress}>{footer.title}</Button>
      </View>
    );
  }

  render() {
    const  { error, fields, buttonTitle, onSubmit, footer } = this.props;

    return (
      <View style={styles.container}>
        <Logo style={styles.header}/>
        <View style={[{flex: 1}, styles.body]}>
          {error && <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>}
          {Object.keys(fields).map(name => this.renderField(name, fields[name]))}
          <Button
            style={styles.button}
            activeStyle={styles.buttonActive}
            textStyle={styles.buttonText}
            textActiveStyle={styles.buttonTextActive}
            onPress={onSubmit}>{buttonTitle.toUpperCase()}</Button>
          {Object.keys(footer).map(name => this.renderFooter(name, footer[name]))}
        </View>
      </View>
    );
  }
}
