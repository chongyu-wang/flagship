import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import Card from '../../components/Card'
import { router } from 'expo-router'

const Home = () => {
  const { data: posts, refetch }= useAppwrite(getAllPosts);
  const { data: latestPosts }= useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);
  // const { data: posts, refetch }= [];
  // const { data: latestPosts }= [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  // console.log(posts);

  // router.replace("/questionaire");

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
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
                  John
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logo}
                  className="w-16 h-10"
                  resizeMode='contain'
                />

              </View>
            </View>
              <SearchInput />
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

export default Home