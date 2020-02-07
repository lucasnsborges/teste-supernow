import { createStackNavigator } from "react-navigation-stack";

import Home from "../screens/Home";
import Profile from "../screens/Profile";

const AppNavigation = createStackNavigator(
  {
    Home: { screen: Home },
    Profile: { screen: Profile }
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

export default AppNavigation;
