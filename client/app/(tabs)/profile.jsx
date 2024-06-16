import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { getCurrentUser, signIn } from '../../lib/appwrite';
import { getVoiceNames, switchUserVoiceSystem } from '../../hooks/useApi';

const Profile = () => {
  const [user, setUser] = useState("");
  const [currentVoice, setCurrentVoice] = useState("Andrew Tate");
  const [voiceNames, setVoiceNames] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getCurrentUser();
      setUser(result.username);
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



  return (
    <SafeAreaView className="bg-primary h-full justify-center items-center">
      <AntDesign name="user" size={64} color={"#A9A9A9"} classname="mb-2"/>
      <Text className="text-slate-300 text-xl">{user}</Text>

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