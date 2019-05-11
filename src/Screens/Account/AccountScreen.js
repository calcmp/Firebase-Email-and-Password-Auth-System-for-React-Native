import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

import firebase from "../../../firebase";
import Button from "../../Components/Button/Button";

import { YellowBox } from "react-native";
import _ from "lodash";

YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

class AccountScreen extends Component {
  state = {
    displayName: "",
    firstName: "",
    lastName: "",
    email: "",
    userId: ""
  };

  /*
   * Get user information from database, set state of user info
   */
  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    console.log(firebase.auth().currentUser);
    firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          this.setState({ displayName: doc.data().displayName });
          this.setState({ firstName: doc.data().firstName });
          this.setState({ lastName: doc.data().lastName });
          this.setState({ email: doc.data().email });
          this.setState({ userId: doc.data().uid });
        } else {
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }

  editProfileNavigate = () => {
    this.props.navigation.navigate("EditScreen");
  };

  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        console.log("Signed out");
      })
      .catch(function(error) {
        console.log("Error: ", error);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Account Screen</Text>
        <Text>Name: {firebase.auth().currentUser.displayName}</Text>
        <Text>Email: {firebase.auth().currentUser.email}</Text>
        <Button onPress={this.signOut}>Sign Out</Button>
        <Button onPress={this.editProfileNavigate}>Edit Profile</Button>
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
    flexDirection: "column"
  }
});

export default AccountScreen;
