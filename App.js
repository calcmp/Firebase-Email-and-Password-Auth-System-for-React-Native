import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";

import AuthScreen from "./src/Screens/Auth/AuthScreen";
import AccountScreen from "./src/Screens/Account/AccountScreen";
import LoadingScreen from "./src/Screens/Loading/LoadingScreen";
import EditScreen from "./src/Screens/Account/EditScreen";
import ReAuthScreen from "./src/Screens/Auth/ReAuthScreen";

class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}

const AppStackNav = createStackNavigator({
  LoadingScreen: LoadingScreen,
  AuthScreen: AuthScreen,
  AccountScreen: AccountScreen,
  EditScreen: EditScreen,
  ReAuthScreen: ReAuthScreen
});

const AppNavigator = createAppContainer(AppStackNav);

export default App;
