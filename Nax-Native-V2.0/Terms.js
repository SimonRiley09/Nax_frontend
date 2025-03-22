import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Linking } from 'react-native';

const {width, height} = Dimensions.get("window")

const Terms = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>By using Nax you acknowledge that you understand that this app does not replace professional help. If you think you are experiencing any sort of addiciton or mental health issues(including scrolling addiction) you should seek professional help. This app is not guaranteed nor proven to help with scrolling and screen addiction and simply has features to make the act of scrolling less exciting and enjoyable. Those features are:{'\n'}-Disabled autoplay{'\n'}-The ability to choose the topic of the videos you watch{'\n'}-Limits on the number of videos that you watch</Text>
    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
    <Text style={{ color: "#A604F2", fontSize: 20, marginTop: 20 }}>Back to Home</Text>
    </TouchableOpacity>
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D17',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: "white",
    marginLeft: 50,
    marginRight: 50,
  },
  bullet: {
    position: "relative",
    color: "white",
    textAlign: "left",
    alignItems: "left",
  }
});

export default Terms;