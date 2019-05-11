import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

import firebase from "../../../firebase";
import Input from "../../Components/Input/Input";
import Button from "../../Components/Button/Button";

class AuthScreen extends Component {
  state = {
    displayName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    newUser: false,
    signingIn: false
  };

  /*
   * Validate email input string
   */
  validateEmail = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      console.log("Email is not correct");
      this.setState({ email: text });
      return false;
    }
    this.setState({ email: text });
    console.log("Email is correct");
  };

  /*
   * On sign in > navigate to account screen
   */
  onPressSignIn = () => {
    this.setState({ signingIn: true });
    console.log(this.state.email);
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.props.navigation.navigate("AccountScreen");
      })
      .catch(function(error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error Code:", errorCode, "\nMessage:", errorMessage);
      });
  };

  /*
   * Create account, update display name, update user in database
   * Navigate to account screen
   */
  onPressCreateAccount = () => {
    this.setState({ signingIn: true });
    console.log(this.state.email);
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        // Update profile display name
        firebase
          .auth()
          .currentUser.updateProfile({
            displayName: this.state.firstName + " " + this.state.lastName
          })
          .then(function() {
            console.log("Display name updated");
          })
          .then(() => {
            // Update user in database
            const userId = firebase.auth().currentUser.uid;
            firebase
              .firestore()
              .collection("users")
              .doc(userId)
              .set({
                displayName: this.state.firstName + " " + this.state.lastName,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email
              });
          })
          .then(() => {
            // Once account create > navigate to account screen
            this.props.navigation.navigate("AccountScreen");
          })
          .catch(function(error) {
            console.error(error);
          });
      })
      .catch(function(error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error Code:", errorCode, "\nMessage:", errorMessage);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        {!this.state.signingIn ? (
          <View style={styles.container}>
            {!this.state.newUser ? (
              <View style={styles.form}>
                {/*If not new user > sign up form*/}
                <Input
                  label="Email"
                  placeholder="Enter your email address..."
                  onChangeText={text => this.validateEmail(text)}
                  value={this.state.email}
                />
                <Input
                  label="Password"
                  placeholder="Enter your password..."
                  secureTextEntry
                  onChangeText={password => this.setState({ password })}
                  value={this.state.password}
                />
                <Button onPress={() => this.onPressSignIn()}>Log In</Button>
                <Button onPress={() => this.setState({ newUser: true })}>
                  Create Account
                </Button>
              </View>
            ) : (
              <View style={styles.form}>
                {/*If new user > sign in form*/}
                <Input
                  label="First Name"
                  placeholder="Enter first name..."
                  onChangeText={firstName => this.setState({ firstName })}
                  value={this.state.firstName}
                />
                <Input
                  label="Last Name"
                  placeholder="Enter your last name..."
                  onChangeText={lastName => this.setState({ lastName })}
                  value={this.state.lastName}
                />
                <Input
                  label="Email"
                  placeholder="Enter your email address..."
                  onChangeText={text => this.validateEmail(text)}
                  value={this.state.email}
                />
                <Input
                  label="Password"
                  placeholder="Enter your password..."
                  secureTextEntry
                  onChangeText={password => this.setState({ password })}
                  value={this.state.password}
                />
                <Button onPress={() => this.onPressCreateAccount()}>
                  Sign Up
                </Button>
                <Button onPress={() => this.setState({ newUser: false })}>
                  I already have an account
                </Button>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.container}>
            {/*When signing in display loading circle*/}
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  form: {
    flex: 1
  }
});

export default AuthScreen;
