import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator, Alert } from "react-native";

import firebase from "../../../firebase";
import Button from "../../Components/Button/Button";
import Input from "../../Components/Input/Input";

class EditScreen extends Component {
  state = {
    hasLoaded: false,
    displayName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPass: "",
    authPass: "",
    userId: ""
  };

  /*
   * Set userId, setTimeout to wait until database is fetched
   */
  componentDidMount() {
    const uid = firebase.auth().currentUser.uid;
    this.setState({ userId: uid });
    // Set loading screen
    setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 2000);

    // Fetch database and set state of users details
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          this.setState({ displayName: doc.data().displayName });
          this.setState({ firstName: doc.data().firstName });
          this.setState({ lastName: doc.data().lastName });
          this.setState({ email: doc.data().email });
        } else {
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }

  returnData = () => {
    this.setState({ authenticated: true });
  };

  /*
   * Alert if first name and last name not empty string
   * Update profile display name and database names
   */
  updateName = () => {
    // Check if first name and last name are empty
    if (this.state.firstName === "") {
      return Alert.alert("Error", "Enter your first name.", [
        { text: "Retry", onPress: () => console.log("Retry Pressed") },
        { cancelable: false }
      ]);
    }
    if (this.state.lastName === "") {
      return Alert.alert("Error", "Enter your last name.", [
        { text: "Retry", onPress: () => console.log("Retry Pressed") },
        { cancelable: false }
      ]);
    }

    // Update profile
    firebase
      .auth()
      .currentUser.updateProfile({
        displayName: this.state.firstName + " " + this.state.lastName
      })
      .then(() => {
        console.log("Name Updated!");
        Alert.alert("Success", "Name updated!", [
          { text: "Ok", onPress: () => console.log("Ok Pressed") },
          { cancelable: false }
        ]);
      })
      .catch(err => console.log(err));

    // Update database
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.userId)
      .update({
        displayName: this.state.firstName + " " + this.state.lastName,
        firstName: this.state.firstName,
        lastName: this.state.lastName
      })
      .then(() => {
        console.log("Document Updated!");
      })
      .catch(err => {
        console.log(err);
      });
  };

  /*
   * Re auth account > update email
   */
  authEmail = () => {
    this.props.navigation.navigate("ReAuthScreen", {
      onGoBack: () => this.updateEmail()
    });
  };

  /*
   * Update login email and database users email
   */
  updateEmail = () => {
    // Update email
    firebase
      .auth()
      .currentUser.updateEmail(this.state.email)
      .then(() => {
        console.log("Email updated");
        Alert.alert("Success", "Email updated!", [
          { text: "Ok", onPress: () => console.log("Ok Pressed") },
          { cancelable: false }
        ]);
      })
      .catch(err => {
        console.log(err);
      });

    // Update database
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.userId)
      .update({
        email: this.state.email
      })
      .then(() => {
        console.log("Document Updated!");
      })
      .catch(err => {
        console.log(err);
      });
  };

  /*
   * Alert if password not the same as confirm password or password < 6
   * Update login password
   */
  updatePassword = () => {
    // Check if passwords match
    if (this.state.password !== this.state.confirmPass) {
      return Alert.alert("Mismatch", "Passwords do not match.", [
        { text: "Retry", onPress: () => console.log("Retry Pressed") },
        { cancelable: false }
      ]);
    }
    if (this.state.password.length < 6) {
      return Alert.alert("Error", "Passwords must be at least 6 characters.", [
        { text: "Retry", onPress: () => console.log("Retry Pressed") },
        { cancelable: false }
      ]);
    }

    // Update password
    firebase
      .auth()
      .currentUser.updatePassword(this.state.password)
      .then(() => {
        console.log("Password updated");
        Alert.alert("Success", "Password updated!", [
          { text: "Ok", onPress: () => console.log("Ok Pressed") },
          { cancelable: false }
        ]);
      })
      .catch(err => {
        console.log(err);
      });
  };

  /*
   * Alert to confirm account deletion
   * Handle re-auth to delete account
   */
  confirmDelete = () => {
    Alert.alert("Warning", "Are you sure you want to delete your account?", [
      {
        text: "Confirm",
        onPress: () =>
          this.props.navigation.navigate("ReAuthScreen", {
            onGoBack: () => this.deleteAccount()
          })
      },
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { cancelable: false }
    ]);
  };

  /*
   * Delete account, go to login page
   */
  deleteAccount = () => {
    firebase
      .auth()
      .currentUser.delete()
      .then(() => {
        Alert.alert("Success", "Account deleted.", [
          { text: "Ok", onPress: () => console.log("Ok Pressed") },
          { cancelable: false }
        ]);
        console.log("User Deleted");
      })
      .catch(err => {
        console.log(err);
      });

    firebase
      .firestore()
      .collection("users")
      .doc(this.state.userId)
      .delete()
      .then(() => console.log("Deleted from database"))
      .catch(err => console.log(err));
  };

  handleBackNavigation = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={styles.container}>
        {!this.state.hasLoaded ? (
          <View style={styles.container}>
            {/*Display loading icon*/}
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <View style={styles.container}>
            {/*Display form*/}
            <View style={styles.form}>
              <Text>Edit Screen</Text>
              <Input
                label="First Name"
                placeholder={this.state.firstName}
                onChangeText={firstName => this.setState({ firstName })}
                value={this.state.firstName}
              />
              <Input
                label="Last Name"
                placeholder={this.state.lastName}
                onChangeText={lastName => this.setState({ lastName })}
                value={this.state.lastName}
              />
              <Button onPress={this.updateName}>Update Name</Button>
              <Input
                label="Email"
                placeholder={this.state.email}
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              />
              <Button onPress={this.authEmail}>Update Email</Button>
              <Input
                label="Password"
                placeholder={this.state.password}
                secureTextEntry
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
              />
              <Input
                label="Confirm Password"
                placeholder={this.state.confirmPass}
                secureTextEntry
                onChangeText={confirmPass => this.setState({ confirmPass })}
                value={this.state.confirmPass}
              />
              <Button onPress={this.updatePassword}>Update Password</Button>
              <Button onPress={this.confirmDelete}>Delete Account</Button>
              <Button onPress={this.handleBackNavigation}>Back</Button>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: "black",
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  form: {
    flex: 1
  }
});

export default EditScreen;
