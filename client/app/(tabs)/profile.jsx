import { View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { getCurrentUser, signIn } from '../../lib/appwrite';

const Profile = () => {
  const [user, setUser] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      const result = await getCurrentUser();
      setUser(result.username);
    };

    fetchUser();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full justify-center items-center">
      <AntDesign name="user" size={64} color={"#A9A9A9"} classname="mb-2"/>
      <Text className="text-slate-300 text-xl">{user}</Text>
    </SafeAreaView>
  )
}

export default Profile