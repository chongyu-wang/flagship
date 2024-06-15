import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, ScrollView } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';
import TypingAnimation from '../components/TypingAnimation';
import { registerUserToBackend } from '../hooks/useApi';
import LottieView from 'lottie-react-native';

export default function App() {
  const { isLoading, isLoggedIn, user } = useGlobalContext();

  useEffect(() => {
    const checkUser = async () => {
      if (!isLoading && isLoggedIn && user.username && user.email) {
  
        await registerUserToBackend(user.username, user.email);
        console.log("registering user");
      }
    };
    checkUser();
  }, [isLoading, isLoggedIn, user]);
  

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      {/* <LottieView 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
        source={require("../assets/lottie/BackgroundAnimation.json")} 
        autoPlay 
        loop 
      /> */}
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View
        className="w-full justify-center items-center min-h-[85vh] px-4">
          <View className="max-w-[380px] w-full h-[250px]"
            style={{
              iosProp: {
                shadowColor: "black",
                shadowOffset: {width:-2, height:4},
                shadowOpacity:0.26,
                shadowRadius:5
              }
            }}
          >
            <Image
              source={images.logo}
              className="max-w-[380px] w-full h-[250px]"
              resizeMode="contain"
            />
          </View>

          <Text className='text-white text-6xl font-bold mb-32'>
            Clone.ly
          </Text>

          <TypingAnimation/>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-3/5 mt-8"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light' />
    </SafeAreaView>
  );
}







// import { StatusBar } from 'expo-status-bar';
// import { Text, View, Image, ScrollView, Button } from 'react-native';
// import { Redirect, router } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { images } from '../constants';
// import  CustomButton  from "../components/CustomButton";

// import { useGlobalContext } from '../context/GlobalProvider';


// export default function App() {
//   const { isLoading, isLoggedIn } = useGlobalContext();

//   if (!isLoading && isLoggedIn) {
//     return <Redirect href="/home" />
//   }

//   return (
//     <SafeAreaView className="bg-primary h-full">
//       <ScrollView contentContainerStyle={{ height: '100%'}}>
//         <View className="w-full justify-center items-center min-h-[85vh] px-4">
//           <Image
//             source={images.logo}
//             className="w-[140px] h-[94px]"
//             resizeMode="contain"
//           />
//           <Image
//             source={images.cards}
//             className="max-w-[380px] w-full h-[250px]"
//             resizeMode="contain"
//           />
//           <View className="relative mt-5">
//             <Text className="text-3xl text-white
//             font-bold text-center">
//               Keep Voices Close with {' '}
//               <Text className="text-secondary-200">Clone.ly</Text>
//             </Text>
//             {/* <Image 
//               source={images.path}
//               className="w-[176px] h-[18px] absolute-bottom-10 -right-20"
//               resizeMode="contain"
//             /> */}
//           </View>

//           <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
//             Your Digital Legacy: Preserve Memories, Share Stories, Forever Together.
//           </Text>

//           <CustomButton 
//           title="Continue with Email"
//           handlePress={() => router.push("/sign-in")}
//           containerStyles="w-full mt-7"
//           />
//         </View>
//       </ScrollView>
//       <StatusBar backgroundColor='#161622' style='light' />
//     </SafeAreaView>
//   );
// }

