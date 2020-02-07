import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";

import TouchableItem from "../../components/TouchableItem";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

export default class ArticleCard extends React.Component {
  state = {
    favorite: false,
    read_time: 0
  };

  componentDidMount() {
    const { article, favorites } = this.props;
    const find_favorite = favorites.find(f => f.id === article.id);
    const read_time = Math.floor(Math.random() * (8 - 4 + 1) + 4);

    this.setState({ read_time })

    if (find_favorite) {
      this.setState({
        favorite: true,
      });
    }
  }

  handleFavorite = () => {
    const {
      article,
      favorites,
      handleAddFavorite,
      handleRemoveFavorite
    } = this.props;

    const find_favorite = favorites.find(f => f.id === article.id);

    if (find_favorite) {
      this.setState({
        favorite: false
      });

      return handleRemoveFavorite(article.id);
    }

    this.setState({
      favorite: true
    });

    return handleAddFavorite(article);
  }

  render() {
    const { article } = this.props;

    if (!article.publishedAt) {
      return null;
    }

    return (
      <TouchableItem style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText} numberOfLines={1}>
            {format(parseISO(article.publishedAt), "dd MMM")} - {this.state.read_time}{" "}
            min read - {article.author}
          </Text>
          <TouchableItem
            rounded style={styles.heartWrapper}
            onPress={() => this.handleFavorite()}
          >
            {
              this.state.favorite ? (
                <FontAwesome
                  name="heart"
                  size={20}
                  color="#F68"
                />
              ) : (
                <FontAwesome
                  name="heart-o"
                  size={20}
                  color="#555"
                />
              )
            }
          </TouchableItem>
        </View>

        <View style={styles.articleInfoContainer}>
          <Text style={styles.articleTitle} numberOfLines={1}>
            {article.title}
          </Text>
          <Text style={styles.articleDescription} numberOfLines={3}>
            {article.description}
          </Text>
        </View>
        {article.urlToImage && (
          <Image
            style={styles.articleImage}
            source={{ uri: article.urlToImage }}
          />
        )}
      </TouchableItem>
    );
  }
}

const fontColorPrimary = "#222";
const fontColorSecondary = "#555";

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
    borderTopColor: "#E5E5E5",
    borderTopWidth: 1
  },

  cardHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  cardHeaderText: {
    fontSize: 12,
    color: fontColorSecondary,
    paddingRight: 8,
    maxWidth: SCREEN_WIDTH - 64
  },

  articleInfoContainer: {
    paddingRight: 48
  },

  articleTitle: {
    color: fontColorPrimary,
    fontSize: 18,
    fontWeight: "bold"
  },

  articleDescription: {
    color: fontColorSecondary,
    marginVertical: 8
  },

  articleImage: {
    flex: 1,
    backgroundColor: "#EEE",
    resizeMode: "cover",
    height: 128
  },

  heartWrapper: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center"
  }
});
