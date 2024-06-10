import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function UserLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="create"
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </>
  )
}