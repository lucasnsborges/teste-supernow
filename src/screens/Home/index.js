import axios from "axios";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert
} from "react-native";

import _ from "lodash";

import { withFirebaseHOC } from "../../api/Firebase";
import { NavigationEvents } from 'react-navigation';

import Avatar from "../../components/Avatar";
import TouchableItem from "../../components/TouchableItem";
import ArticleCard from "./ArticleCard";

const HEADER_EXPANDED_HEIGHT = 300;
const HEADER_COLLAPSED_HEIGHT = 60;
const PLACEHOLDER_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
const PUBLIC_API_URL =
  "https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=978281cc1e1e4aa3b2b5627e01710a7c";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

class Home extends Component {
  constructor() {
    super();

    this.state = {
      scrollY: new Animated.Value(0),
      articles: [],
      fullname: "",
      profileImage: ""
    };
  }

  async componentDidMount() {
    const { data } = await axios(PUBLIC_API_URL);

    this.setState({
      articles: data.articles
    })
  }

  async getUserDetails() {
    const { firebase } = this.props;

    const user = firebase.currentUser();
    const info = await firebase.getUserInfo(user.uid);

    this.setState({
      fullname: `${info[0].firstName} ${info[0].lastName}`,
      profileImage: info[0].profileImage,
    })
  }

  handleNavigateProfile = () => {
    this.props.navigation.navigate("Profile");
  }

  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
      extrapolate: "clamp"
    });

    const headerRightSideOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [0, 1],
      extrapolate: "clamp"
    });

    const heroTitleOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT - 150],
      outputRange: [1, 0],
      extrapolate: "clamp"
    });

    const { fullname, profileImage, articles } = this.state;

    return (
      <View style={styles.container}>
        <NavigationEvents
          onDidFocus={() => this.getUserDetails()}
        />
        <Animated.View
          style={[styles.headerContainer, { height: headerHeight }]}
        >
          <View style={styles.headerBar}>
            <Animated.View
              style={[
                styles.headerLeftSide,
                { opacity: headerRightSideOpacity }
              ]}
            >
              <Avatar
                size={34}
                letter={fullname.slice(0, 1)}
                source={{ uri: profileImage || PLACEHOLDER_IMAGE }}
              />
              <Text style={styles.headerRightText}>{fullname}</Text>
            </Animated.View>
            <TouchableItem
              onPress={() => this.handleNavigateProfile()}
              rounded
              style={styles.headerRightSide}
            >
              <FontAwesome5 name="edit" size={22} color="#333" />
            </TouchableItem>
          </View>

          <Animated.View
            style={[styles.heroContainer, { opacity: heroTitleOpacity }]}
          >
            <Avatar
              size={84}
              letter={fullname.slice(0, 1)}
              source={{ uri: profileImage || PLACEHOLDER_IMAGE }}
            />
            <Text style={styles.usernameText}>{fullname}</Text>
          </Animated.View>
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  y: this.state.scrollY
                }
              }
            }
          ])}
          scrollEventThrottle={16}
        >
          {articles.map((_, i) => (
            <ArticleCard article={_} key={i} />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const fontColorSecondary = "#555";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },

  scrollContainer: {
    paddingVertical: 16,
    paddingTop: HEADER_EXPANDED_HEIGHT
  },

  headerContainer: {
    backgroundColor: "#EEE",
    borderBottomWidth: 1,
    borderBottomColor: "#D5D5D5",
    position: "absolute",
    width: SCREEN_WIDTH,
    top: 0,
    left: 0,
    zIndex: 9999
  },

  headerBar: {
    display: "flex",
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  headerLeftSide: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    margin: 8
  },

  headerRightSide: {
    margin: 8,
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center"
  },

  headerRightText: {
    color: fontColorSecondary,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8
  },

  heroContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  usernameText: {
    color: fontColorSecondary,
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16
  }
});

export default withFirebaseHOC(Home);
