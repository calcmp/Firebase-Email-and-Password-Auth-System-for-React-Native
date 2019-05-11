import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

import firebase from "../../../firebase";

class LoadingScreen extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  /*
   * Check if user is already logged in or has logged in
   */
  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(user => {
      // If user not logged in > navigate to auth screen
      if (!user) return this.props.navigation.navigate("AuthScreen");

      // If user logged in > navigate to account screen
      setTimeout(() => {
        this.props.navigation.navigate("AccountScreen");
      }, 1000);
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default LoadingScreen;
