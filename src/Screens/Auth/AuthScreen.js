import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";

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
    confirmPass: "",
    newUser: false,
    signingIn: false
  };

  /*
   * On sign in > navigate to account screen
   */
  onPressSignIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        // Set signingIn true to display loading icon
        this.setState({ signingIn: true });
        this.props.navigation.navigate("AccountScreen");
      })
      .catch(() => {
        Alert.alert("Error", "Incorrect email and/or password.", [
          { text: "Retry" }
        ]);
      });
  };

  /*
   * Check if firstName and lastName not empty string
   * Check if passwords match and > 6 characters
   * Create account, update display name, update user in database
   * Navigate to account screen
   */
  onPressCreateAccount = () => {
    // Check if firstName and lastName exist
    if (this.state.firstName === "") {
      return Alert.alert("Error", "Enter your first name.", [
        { text: "Retry" }
      ]);
    }
    if (this.state.lastName === "") {
      return Alert.alert("Error", "Enter your last name.", [{ text: "Retry" }]);
    }

    // Check if passwords match
    if (this.state.password !== this.state.confirmPass) {
      return Alert.alert("Mismatch", "Passwords do not match.", [
        { text: "Retry" },
        { cancelable: false }
      ]);
    }
    if (this.state.password.length < 6) {
      return Alert.alert("Error", "Passwords must be at least 6 characters.", [
        { text: "Retry" },
        { cancelable: false }
      ]);
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        // Set signingIn true to display loading icon
        this.setState({ signingIn: true });

        // Update profile display name
        firebase
          .auth()
          .currentUser.updateProfile({
            displayName: this.state.firstName + " " + this.state.lastName
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
          .catch(error => {
            console.error(error);
          });
      })
      .catch(() => {
        Alert.alert("Error", "Invalid email address.", [{ text: "Retry" }]);
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
                  onChangeText={email =>
                    this.setState({ email: email.replace(/\s/g, "") })
                  }
                  value={this.state.email}
                  keyboardType="email-address"
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
                  onChangeText={firstName =>
                    this.setState({ firstName: firstName.replace(/\s/g, "") })
                  }
                  value={this.state.firstName}
                />
                <Input
                  label="Last Name"
                  placeholder="Enter your last name..."
                  onChangeText={lastName =>
                    this.setState({ lastName: lastName.replace(/\s/g, "") })
                  }
                  value={this.state.lastName}
                />
                <Input
                  label="Email"
                  placeholder="Enter your email address..."
                  onChangeText={email =>
                    this.setState({ email: email.replace(/\s/g, "") })
                  }
                  value={this.state.email}
                  keyboardType="email-address"
                />
                <Input
                  label="Password"
                  placeholder="Enter your password..."
                  secureTextEntry
                  onChangeText={password => this.setState({ password })}
                  value={this.state.password}
                />
                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password..."
                  secureTextEntry
                  onChangeText={confirmPass => this.setState({ confirmPass })}
                  value={this.state.confirmPass}
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
