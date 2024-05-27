import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, ScrollView } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import TypeWriter from 'react-native-typewriter';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  const [curText, setCurText] = useState(0);

  useEffect(() => {
    let timeoutId;
    const interval = setInterval(() => {
      setCurText((prevText) => (prevText === 0 ? 1 : prevText === 1 ? 2 : 0));

      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        clearInterval(interval); // Clear interval to prevent overlapping
      }, 2000);

    }, curText === 0 ? 2000 : curText === 1 ? 3000 : 5000); // Change interval based on curText value

    // Clear the interval on component unmount to avoid memory leaks
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [curText]); // Re-run effect whenever curText changes

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source={images.logo}
            className="max-w-[380px] w-full h-[250px]"
            resizeMode="contain"
          />

          <Text className='text-white text-6xl font-bold mb-32'>
            Clone.ly
          </Text>

          {curText === 0 ? 
            (<TypeWriter typing={1} className="text-gray-100">Keep Voices Close.</TypeWriter>):
          curText == 1 ?
            (<TypeWriter typing={1} className="text-gray-100 text-align-center">Your Digital Legacy.</TypeWriter>):
          (<TypeWriter typing={1} className="text-gray-100 text-align-center">Preserve Memories, Share Stories, Forever Together.</TypeWriter>)
          }


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

