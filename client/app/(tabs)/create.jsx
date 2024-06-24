import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Image, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import { FontAwesome } from "@expo/vector-icons";

const Create = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const onSubmit = () => {
    // Handle form submission
    console.log({ title, description, date, image });
  };

  return (
    <SafeAreaView className="bg-primary h-full p-6 min-h-[85vh]">
      <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <TouchableOpacity onPress={onSubmit} className="absolute top-1 right-1">
            <FontAwesome name="send" size={32} color={"#A9A9A9"}/>
          </TouchableOpacity>
          <View className="mb-8 mt-10">
            <Text className="text-white text-lg font-semibold mb-2">Event Title</Text>
            <TextInput
              className="border border-gray-500 p-3 rounded-3xl text-white"
              placeholder="Enter event title"
              placeholderTextColor="#ccc"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View className="mb-8">
            <Text className="text-white text-lg font-semibold mb-2">Event Picture</Text>
            <TouchableOpacity onPress={pickImage} className="border border-gray-500 p-3 rounded-3xl items-center">
              <Text className="text-white mb-1">Pick an image</Text>
              <FontAwesome name="photo" size={32} color={"#A9A9A9"}/>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10, borderRadius: 10 }} />}
          </View>

          <View className="mb-8">
            <Text className="text-white text-lg font-semibold mb-2">Event Description</Text>
            <TextInput
              className="border border-gray-500 p-3 rounded-3xl text-white h-40"
              placeholder="Enter event description"
              placeholderTextColor="#ccc"
              multiline
              value={description}
              onChangeText={setDescription}
              numberOfLines={4}
            />
          </View>

          <View className="mb-8">
            <Text className="text-white text-lg font-semibold mb-2">Event Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} className="border border-gray-500 p-3 rounded-3xl">
              <Text className="text-white">{date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || date;
                  setShowDatePicker(false);
                  setDate(currentDate);
                }}
              />
            )}
          </View>

          {/* <CustomButton
            title="Submit Event"
            handlePress={onSubmit}
            containerStyles="p-3 rounded-3xl bg-slate-800"
            textStyles="text-slate-200 text-lg font-semibold"
          /> */}
        </View>
      </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;

