import React, { Component } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";

import firebase from "../../../firebase";
import Input from "../../Components/Input/Input";
import Button from "../../Components/Button/Button";

class ReAuthScreen extends Component {
  state = {
    password: ""
  };

  /*
   * Re-authorise account if password is correct > go back
   */
  handleReAuth = () => {
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      this.state.password
    );

    // Prompt the user to re-provide their sign-in credentials
    user
      .reauthenticateWithCredential(credential)
      .then(() => {
        // User re-authenticated.
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
      })
      .catch(error => {
        // An error happened.
        Alert.alert("Error", "Incorrect password.", [
          { text: "Retry" },
          { cancelable: false }
        ]);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <Text>Enter your password to continue</Text>
          <Input
            label="Password"
            placeholder="Enter your password..."
            secureTextEntry
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          <Button onPress={this.handleReAuth}>Confirm</Button>
          <Button onPress={() => this.props.navigation.goBack()}>Back</Button>
        </View>
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

export default ReAuthScreen;
