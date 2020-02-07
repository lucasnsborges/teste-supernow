import { createStackNavigator } from "react-navigation-stack";
import Login from "../screens/Auth/Login";
import Signup from "../screens/Auth/Signup";

const AuthNavigation = createStackNavigator(
  {
    Login: { screen: Login },
    Signup: { screen: Signup }
  },
  {
    initialRouteName: "Login",
    headerMode: "none"
  }
);

export default AuthNavigation;
