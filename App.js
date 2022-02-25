import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginView } from './views/LoginView';
import { AuthProvider } from './providers/AuthProvider';
import { JoysView } from './views/JoysView';
import { Logout } from "./components/Logout";
import { JoysProvider } from './providers/JoysProvider';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
              name="Login View"
              component={LoginView}
              options={{ title: "Jar of Joy" }}
            />
          <Stack.Screen
              name="Joys"
             >
               {() => {
                return (
                  <JoysProvider>
                    <JoysView />
                  </JoysProvider>
                );
              }} 
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
