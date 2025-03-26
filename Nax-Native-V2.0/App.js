import { StatusBar } from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, FlatList, Dimensions, SafeAreaView, useWindowDimensions } from 'react-native';
import { useState, useMemo, useRef, useEffect, use} from 'react';
import React from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { WebView } from 'react-native-webview';
import AboutMe from './About_me';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './loadingScreen';
import * as Crypto from 'expo-crypto';
import Terms from './Terms';
import  * as  SplashScreen from 'expo-splash-screen';

// Don't automatically hide the splash screen
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

const {width, height} = Dimensions.get("window")

const Stack = createNativeStackNavigator();


// HomeScreen component
const HomeScreen = ({ navigation, query, setQuery, handleSubmit, maxResults, setMaxResults, channel, setChannel, numTextInputs, setNumTextInputs, data, error, setData, setError, queryString, setQueryString, api}) => (
  // Logo
  <View style={styles.container}>
    <View style={{ marginTop:0, marginBottom: 60, justifyContent: "center", alignItems: "center"}}>
      <FontAwesome6 name="brain" size={30} color="#A604F2" style={styles.brainIcon}/>
      <Feather name="shield" size={100} color="#A604F2" style={{position: "absolute"}} />
    </View>
    {/* Settings container */}
    <View style={styles.settingsContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Nax</Text>
        <Text style={styles.textDescription}>Don't let algorithms decide what you watch</Text>
      </View>
      <TextInput
        style={styles.input1}
        value={queryString}
        onChangeText={(value) => setQueryString(value)} // Update the state when the text changes
        placeholder='keywords/hashtags'
      />
      <TextInput
        style={styles.input}
        placeholder='max videos'
        value={maxResults}
        onChangeText={(value) => setMaxResults(value)}
        keyboardType='numeric'
      />
      <TouchableOpacity style={styles.button} onPress={() => handleSubmit(navigation)}>
        <Text style={{fontSize: 15, color: "white", fontWeight: 900}}>Watch</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{position: "absolute", bottom: 5, left: 10, right:10}} onPress={() => navigation.navigate('Terms')}>
            <Text style={{color: "grey", fontSize: 11}}>By continuing, you agree to the<Text style={{textDecorationLine: "underline", color:"#A604F2"}}> Disclaimer</Text></Text>
      </TouchableOpacity>
      {error && <Text style={styles.errors}>{JSON.stringify(error)}</Text>}
      {api && <Text style={{color: "green"}}>{api}</Text>}
      <StatusBar style="auto" />
    </View>
  
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate('AboutMe')}>
            <Text style={styles.bottomText}>About Me</Text>
      </TouchableOpacity>
    </View>
    <Text style={{position: "absolute", bottom: 5, left:0, color: "grey", marginLeft: 10, marginRight: 10, fontSize: 9}}>© 2025 Shayan Shamsi Pour Siahmazgi. All rights reserved.</Text>
  </View>
);


// VideoScreenWrapper component
function VideoScreenWrapper({ navigation, data, maxResults, setError }) {
  const flatListRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const webViewRefs = useRef([]);

  // Memorize the data
  // Add a final page to the video feed
    const modifiedData = useMemo(() => {
      try{
      if (data && data.data) {
        return [...data.data, { type: 'finalPage' }];
      }}catch(e){
        setError("Something went wrong, try again!")
        navigation.navigate("Home")
        return;
      }}, [data, data.data]);

  
    // Loading page
  useEffect(() => {
    if (data) {
      setLoading(false);
    }else if (!data) {
      setLoading(true);
    }
  }
  , [data]);

  // Return Loading screen if data is not available yet
  if (loading) {
    return <LoadingScreen />;
  }
  const handleViewableItemsChanged = ({ viewableItems }) => {
    // Find the index of the visisble item
    const visibleIndex = viewableItems[0]?.index;
    if (visibleIndex !== undefined && visibleIndex !== currentVideoIndex) {
      setCurrentVideoIndex(visibleIndex);
      //const currentVideo = data.data[currentVideoIndex];
      //console.log(currentVideo);
      webViewRefs.current.forEach((ref, index) => {
        // Pause the video if it's not the currently visible one
        if (ref && index !== visibleIndex) {
          ref.injectJavaScript('document.querySelector("video").pause();');
        }
      });
    }
  };



  try {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "black", height: height, width: width }}>
        <View style={{ backgroundColor: "black", height: height, width: width, marginTop: 0, marginBottom: 0, padding: 0, justifyContent: "center", alignItems: "center" }}>
          <FlatList
            style={{ flex: 1, marginBottom: 0, padding: 0, backgroundColor: "black" }}
            //was data.data
            data={modifiedData}
            renderItem={({ item, index }) => {
              if (item.type === 'finalPage') {
                return (
                  <View style={{ backgroundColor: "black", height: height, width: width, flex: 1, alignItems: 'center', justifyContent: 'center', display: 'flex', marginTop: 0, marginBottom: 0 }}>
                    <MaterialIcons name="grass" size={100} color="#A604F2" />
                    <Text style={{ color: "white", fontSize: 30 }}>Go touch some grass</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                      <Text style={{ color: "#A604F2", fontSize: 20, marginTop: 20 }}>Back to Home</Text>
                    </TouchableOpacity>
                  </View>
                );
              }
              return(
                <View>
                <WebView
                  ref={(ref) => (webViewRefs.current[index] = ref)}
                  source={{ uri: item }}
                  style={{ backgroundColor: "black", height: height, width: width, flex: 1, alignItems: 'center', justifyContent: 'center', display: 'flex', marginTop: 0, marginBottom: 0 }}
                  mediaPlaybackRequiresUserAction={true}
                  javaScriptEnabled={true}
              />
              </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            pagingEnabled
            initialNumToRender={1}
            showsVerticalScrollIndicator={false}
            ref={flatListRef}
            onViewableItemsChanged={handleViewableItemsChanged}
          />
        </View>
      </SafeAreaView>
    );
  } catch (error) {
    console.log(error);
  }
}

export default function App() {
  const [maxResults, setMaxResults] = useState(5);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState([]);
  const [channel, setChannel] = useState([]);
  const [numTextInputs,setNumTextInputs] = useState(0);
  const [numVideos, setNumVideos] = useState(0);
  const [queryString, setQueryString] = useState("");
  const [isFirstLaunched, setIsFirstLaunched] = useState(null)
  const [loading, setLoading] = useState(false);
  const [api, setAPI] = useState(null);

  SplashScreen.hideAsync();

  
  // Check if the app is launched for the first time
  useEffect(() =>{
    const checkFirstLaunch = async () => {
      try{

        // Get hasLAunched from AsyncStorage
        const hashLaunched = await AsyncStorage.getItem('hasLaunched');
        // If nothing is found for hasLaunched
        if (hashLaunched===null){
          try {
            // Generate a unique frontID for the device
            const frontID = Crypto.randomUUID();
            // Set the item of frontID in AsyncStorage
            await AsyncStorage.setItem('frontID', frontID);
            // Send the frontID to the server to get an api_key
            const sendID = await fetch(`http://209.59.180.103:1028/api/keys`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                frontID: frontID,
              }),
            });
            
            if (!sendID.ok) {
              console.log('error sending device ID');
            }
            // Parse the response to get the api_key
            const sendIDJson = await sendID.json();
            // Get the api key
            const api_key = sendIDJson.api_key;
            // Set the api_key in AsyncStorage
            await AsyncStorage.setItem('api_key', api_key);
          } catch (error) {
            console.log(`error sending device ID: ${error}`);
          }
          //set hashLaunched to true
          await AsyncStorage.setItem('hasLaunched', 'true');
          setIsFirstLaunched(true)
        } else {
          setIsFirstLaunched(false)
        }
        const API = await AsyncStorage.getItem('api_key');
        setAPI(API);        
      }
      catch (error){
        console.error('Error Checking first launch: ', error);
      }
  };
  checkFirstLaunch();
  }, []);


  // Handle multiple keywords and hashtags
  const handleQuery = async(query, queryString,) =>{
    try{
      query.length = 0;
      let currentWord = "";
      for(let i = 0; i<=queryString.length; i++){
        let character = queryString[i];
        if(character==" " || character==","){
          if (currentWord){
            query.push(currentWord);
            currentWord = "";
          }
        }else if(character!=undefined){
          currentWord += character;
        }
      }
      if(currentWord){
          query.push(currentWord)
        }
    }catch(error){
      console.log(`error from handle query: ${error}`)
    }
  }


  const handleSubmit = async (navigation) =>{
    setError(null);
    setData(null);
    setLoading(true);


    // if both channel and query are entered, show an error
    if (channel && query && channel.length > 0){
      setError("Please only enter a channel or a query, not both");
      setLoading(false);
      return;
    }
    // If neither channel nor query is entered, show an error
    else if (!channel && !query){
      setError("Please enter one or more keywords or hashtags");
      setLoading(false);
      return;
    }
    // If queryString is empty, show an errorz
    else if (queryString==""){
      setQueryString(null)
      setError("Please enter one or more keywords or hashtags")
      setLoading(false);
      return;
    } 
    // If maxResults is not a number, show an error
    else if (maxResults < 1 || maxResults > 45){
      setError("maxResults must be between 1 and 45")
      setLoading(false);
      return;
    }
    // If query is empty, show an error
    else if (!query){
      setError("Please enter one or more keywords or hashtags")
      setLoading(false);
      return;
    }
      try{
        handleQuery(query, queryString);
      }catch(error){
        console.log(`error while converting: ${error}`);
      }

      
      try {
        // Send the data to the server
        const response = await fetch(`http://209.59.180.103:1025/api/settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json",
            "X-Api-Key": await AsyncStorage.getItem('api_key'),
            "X-Front-ID": await AsyncStorage.getItem('frontID'),
           },
          body: JSON.stringify({
            number_of_shorts: maxResults,
            query: query,
            channel: channel,
          }),
        });        

      if(!response.ok){
        const errData = await response.json();
        setError("Please enter one or more keywords or hashtags");
        setLoading(false);
        return;
      }

      // Parse the json response
      const dataJson = await response.json();
      setData(dataJson);
      setError(dataJson);
      setLoading(false);
      // Navigate to the VideoScreen with the data
      {/*navigation.navigate('VideoScreen', {
        data: dataJson,
        numVideos: maxResults
      });*/}
    }catch (error) { 
      setError(error); 
    }
  }



  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          screenEnabled: false,
        }}
        styles={{backgroundColor: "black"}}
      >
      <Stack.Screen name="Home">
        {({navigation}) => (
            <View style={{flex: 1}}>
                {loading && <LoadingScreen/>}
                {!loading && (
                    <HomeScreen 
                        navigation={navigation}
                        query={query}
                        setQuery={setQuery}
                        maxResults={maxResults}
                        setMaxResults={setMaxResults}
                        channel={channel}
                        setChannel={setChannel}
                        numTextInputs={numTextInputs}
                        setNumTextInputs={setNumTextInputs}
                        error={error}
                        setError={setError}
                        handleSubmit={handleSubmit}
                        queryString={queryString}
                        setQueryString={setQueryString}
                        api={api}
                    />
                )}
            </View>
        )}
    </Stack.Screen>
        <Stack.Screen name="VideoScreen">
      {({navigation}) => (
        <VideoScreenWrapper
          navigation={navigation}
          data={data}
          numVideos={numVideos}
          maxResults={maxResults}
          setError={setError}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="AboutMe" component={AboutMe}/>
        <Stack.Screen name="Terms" component={Terms} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
 //{error && <Text>{error}</Text>}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: '#0A0D17',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    bottom: 10,
    flexDirection: "row",
    gap: 20,
  },
  bottomText: {
    color: "grey",
    marginTop: 20,
    textDecorationLine: "underline",
    fontSize: 12,
  },
  text: {
    fontSize: 30,
    fontWeight: 600,
    color: "white",
  },
  textDescription: {
    fontSize: 16,
    fontWeight: 400,
    color: "white",
    opacity: .6,
    marginLeft: "5%",
    marginRight: "5%",
    textAlign: "center",
    marginBottom: 30,
  },
  settingsContainer:{
    backgroundColor: "#3b3d45",
    width: width*.75,
    height: height*.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  textContainer:{
    position: "absolute",
    top: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    position: 'absolute',
    color: "black",
    backgroundColor: "#b6b6b9",
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 10,
    top:220,
    width: "75%",
    height: "11%",
  },
  input1: {
    position: "absolute",
    color: "black",
    backgroundColor: "#b6b6b9",
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 10,
    top: 140,
    width: "75%",
    height: "11%",
  },
  errors: {
    position: "absolute",
    color: "red",
    bottom: 30,
    left:10,
  },
  button:{
    position: "absolute",
    backgroundColor: "#A604F2",
    color: "#A604F2",
    borderRadius: 5,
    width: "27.027027027%",
    height:  34,
    bottom: 100,
    alignItems: "center",
    justifyContent: "center",
  },

  brainIcon: {
    position: "absolute",
  }
});
