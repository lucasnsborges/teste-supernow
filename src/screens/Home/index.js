import axios from "axios";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";

import _ from "lodash";
import uuid from 'uuid';

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

class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      scrollY: new Animated.Value(0),
      articles: [],
      favorites: [],
      fullname: "",
      profileImage: ""
    };
  }

  async componentDidMount() {
    const { firebase } = this.props;
    const articles = await firebase.getArticles();
    const favorites = await firebase.getFavorites();

    this.handleArticles();

    this.setState({
      articles: articles.reverse(),
      favorites
    })
  }

  async handleArticles()  {
    const { firebase } = this.props;
    const { data } = await axios(PUBLIC_API_URL);

    const articles = data.articles;

    articles.forEach((article) => {
      article.id = uuid.v4();
    });

    const saveNewArticles = articles.map(async (a) => {
      const all_articles = await firebase.getArticles();
      const find = all_articles.find(s => s.url === a.url);

      if (!find) {
        const create = await firebase.createArticle(a);

        return create;
      }
    })

    Promise.all(saveNewArticles).then(async () => {
      const getAllArticles = await firebase.getArticles();

      this.setState({
        articles: getAllArticles.reverse()
      })
    });
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

  handleAddFavorite = async (article) => {
    const { firebase } = this.props;
    const add = await firebase.addFavorite(article);
    const favorites = await firebase.getFavorites()

    add && this.setState({ favorites })
  }

  handleRemoveFavorite = async (id) => {
    const { firebase } = this.props;
    const remove = await firebase.removeFavorite(id);
    const favorites = await firebase.getFavorites()

    remove && this.setState({ favorites })
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

    const { fullname, profileImage, articles, favorites } = this.state;

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
              rounded
              style={styles.headerRightSide}
              onPress={() => this.handleNavigateProfile()}
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

            <TouchableOpacity
              style={{ marginTop: 16 }}
              onPress={() => console.log("navigation screen")}
            >
              <Text style={styles.textUnderline}>Favoritos: {favorites.length}</Text>
            </TouchableOpacity>
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
          {articles.map((a, i) => (
            <ArticleCard
              key={i}
              article={a}
              favorites={favorites}
              handleAddFavorite={this.handleAddFavorite}
              handleRemoveFavorite={this.handleRemoveFavorite}
            />
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
  },

  textUnderline: {
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline"
  },
});

export default withFirebaseHOC(Home);
