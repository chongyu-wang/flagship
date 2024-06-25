import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Image, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AWS from 'aws-sdk';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../../components/CustomButton';
import { Buffer } from 'buffer';


const s3 = new AWS.S3({
  accessKeyId: 'AKIA4FLOFCEI2MWJF4PT',
  secreteAccessKey: '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',
  region: 'us-east-2',
});

const Create = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const pickImage = async () => {
    console.log('picking image');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      if (result.assets[0].uri) {
        setImage(result.assets[0].uri);
        console.log('Selected image URI: ', result.assets[0].uri);
      } else {
        Alert.alert('Error: URI is undefined');
      }
    } else {
      console.log('User cancelled image picker');
    }
  };

  const uploadImageToS3 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const params = {
        Bucket: 'dyen-test-access-point',
        Key: `${Date.now()}-${title}`, // Unique key for the uploaded file
        Body: blob,
        ContentType: 'image/png', // Adjust according to the file type
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.log('Error uploading image: ', err);
        } else {
          console.log('Successfully uploaded image: ', data.Location);
        }
      });
    } catch (error) {
      console.log('Error in uploadImageToS3: ', error);
    }
  };

  const onSubmit = () => {
    if(image){
      console.log(title, description, date, image);
      uploadImageToS3(image);
      console.log('submitting event');
    }
    else{
      console.log('No image selected');
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full p-4 min-h-[85vh]">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Create;

