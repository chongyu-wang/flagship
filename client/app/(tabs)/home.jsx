import { View, Text, FlatList, Image, RefreshControl, TouchableOpacity, ScrollView, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import Card from '../../components/Card'
import { getCurrentUser, signIn } from '../../lib/appwrite';
import LottieView from 'lottie-react-native';
import { SearchBar } from 'react-native-elements'
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";


const Home = () => {
  const { data: posts, refetch }= useAppwrite(getAllPosts);
  const { data: latestPosts }= useAppwrite(getLatestPosts);
  const [user, setUser] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const updateSearch = (search) => {
    setSearch(search);
  };


  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getCurrentUser();
      setUser(result.username);
    };

    fetchUser();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <LottieView 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
        source={require("../../assets/lottie/BackgroundAnimation.json")} 
        autoPlay 
        loop 
      />
      <FlatList
        style={{marginBottom: 0,
          paddingBottom: 0,
          overflow: "auto",
        }}
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Card video = {item }/>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start
            flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm
                text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold
                text-white">
                  {user}
                </Text>
              </View>
                <Image
                  source={images.logo}
                  className="w-16 h-10"
                  resizeMode='contain'
                />
            </View>
            <SearchBar
            placeholder=""
            placeholderTextColor="#8E8E93" // iOS default placeholder color
            onChangeText={updateSearch}
            value={search}
            platform="ios"
            searchIcon={<AntDesign name="search1" size={20} />}
            containerStyle={{
              backgroundColor: "transparent",
              width: "100%"
            }}
            inputContainerStyle={{
              height: 36,
              backgroundColor: "#222222",
            }}
            inputStyle={{
              height: 36, 
            }}
            />
              <View className="w-full pt-5 pb-8">
                <Text className="font-pregular mb-3 text-white">
                  Events
                </Text>
                <Trending posts={latestPosts ?? []} />
              </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title = "No Events Found"
            subtitle="Add an event"
          />
        )}
        refreshControl={<RefreshControl 
          refreshing = {refreshing}
          onRefresh={onRefresh}
          />}
      />
    </SafeAreaView>

  )
}

export default Home;