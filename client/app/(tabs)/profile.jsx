import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { getCurrentUser, signIn, signOut } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { getVoiceNames, switchUserVoiceSystem } from '../../hooks/useApi';
import { Link, router } from 'expo-router';

const Profile = () => {
  const [curUser, setCurUser] = useState("");
  const [currentVoice, setCurrentVoice] = useState("");
  const [voiceNames, setVoiceNames] = useState([]);

  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getCurrentUser();
      setCurUser(result.username);
    };
    const fetchVoiceNames = async () => {
      const result = await getVoiceNames();
      console.log(result)
      setVoiceNames(result);
    }
    fetchUser();
    fetchVoiceNames();

  }, []);

  const handleNamePress = async(name) => {
    await switchUserVoiceSystem(name);
    setCurrentVoice(name);
  }


  const logOut = async() => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace("/sign-in");
  }



  return (
    <SafeAreaView className="bg-primary h-full justify-center items-center">
      <TouchableOpacity className="mb-8" onPress={logOut}>
        <Text className="text-white">
          Sign Out
        </Text>
      </TouchableOpacity>
      <AntDesign name="user" size={64} color={"#A9A9A9"} classname="mb-2"/>
      <Text className="text-slate-300 text-xl">{curUser}</Text>

      <Text className="text-slate-300 my-8">Current voice System: {currentVoice} </Text>
      {voiceNames.map(voice => (
        <TouchableOpacity
          key={voice.id} onPress={() => handleNamePress(voice.voicename)}
          className={`my-2 border-2 rounded-3xl w-3/5 items-center
          ${ voice.voicename === currentVoice ? "border-blue-500": "border-slate-500"}`}
        >
          <Text className={`${ voice.voicename === currentVoice ? "text-blue-500": "text-slate-500"} my-2 mx-2`}>{voice.voicename}</Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  )
}

export default Profile