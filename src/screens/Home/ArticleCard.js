import React, { Component } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";

import TouchableItem from "../../components/TouchableItem";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

export default class ArticleCard extends Component {
  render() {
    let { article } = this.props;
    const read_time = Math.floor(Math.random() * (8 - 4 + 1) + 4);

    return (
      <TouchableItem style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText} numberOfLines={1}>
            {format(parseISO(article.publishedAt), "dd MMM")} - {read_time} min
            read - {article.author}
          </Text>
          <View>
            <FontAwesome5 name="heart" size={20} color={fontColorSecondary} />
          </View>
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
  }
});
