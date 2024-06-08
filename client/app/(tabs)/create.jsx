import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../../components/CustomButton';

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
    <SafeAreaView className="bg-primary h-full p-4 min-h-[85vh]">
      <View>
      <View className="mb-4 mt-16">
        <Text className="text-white text-lg mb-2">Event Title</Text>
        <TextInput
          className="border p-2 rounded-2xl border-secondary text-white"
          placeholder="Enter event title"
          placeholderTextColor="#ccc"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View className="mb-4">
        <Text className="text-white text-lg mb-2">Event Description</Text>
        <TextInput
          className="border p-2 rounded-2xl border-secondary text-white"
          placeholder="Enter event description"
          placeholderTextColor="#ccc"
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View className="mb-4">
        <Text className="text-white text-lg mb-2">Event Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} className="border p-2 rounded-2xl border-secondary">
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

      <View className="mb-4">
        <Text className="text-white text-lg mb-2">Event Picture</Text>
        <TouchableOpacity onPress={pickImage} className="border p-2 rounded-2xl border-secondary items-center">
          <Text className="text-white">Pick an image</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10 }} />}
      </View>

      <CustomButton
            title="Submit Event"
            handlePress={onSubmit}
            containerStyles="w-3/5 mt-8"
          />
      </View>
    </SafeAreaView>
  );
};

export default Create;
