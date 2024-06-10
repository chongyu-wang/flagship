import { View, Text, ScrollView, Image, Alert } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider';

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {

    if (!form.username || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields');
    }

    setIsSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);

      // set it to global state...
      setUser(result);
      setIsLoggedIn(true);

      router.replace('/survey');

    } catch(error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center 
        min-h-[82vh] px-4 my-6">
          <Image source={images.logo} 
          resizeMode='contain' className="w-[115px] h-[75px] mb-4" />

          <Text className="text-2xl text-white text-semibold 
          mt-10 font-psemibold my-4">
            Sign Up to Clone.ly
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({...form, username: e })}
            otherStyles="mt-10"
            // placeholder={"email"}
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
            // placeholder={"email"}
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({...form, password: e })}
            otherStyles="mt-7"
            // placeholder={"password"}
          />
          {/* <FormField
            title="Confirm Password"
            value={form.confirmPassword}
            handleChangeText={(e) => setForm({...form, confirmPassword: e })}
            otherStyles="mt-7"
            // placeholder={"password"}
          /> */}
          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp