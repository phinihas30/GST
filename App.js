import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { Text } from 'react-native';
import { enableScreens } from 'react-native-screens';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Enable screens
enableScreens();

// Import screens
import HomeScreen from './screens/HomeScreen';
import CalculatorScreen from './screens/CalculatorScreen';
import RecordsScreen from './screens/RecordsScreen';
import ProfileScreen from './screens/ProfileScreen';

// Import theme
import { paperTheme } from './theme';

// Create tab navigator
const Tab = createBottomTabNavigator();

// Main app with tab navigation
export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator 
            screenOptions={{
              tabBarActiveTintColor: '#0d6efd',
              tabBarInactiveTintColor: '#6c757d',
              tabBarStyle: {
                height: 60,
                paddingBottom: 10,
                paddingTop: 5,
              },
              headerShown: false,
            }}
          >
            <Tab.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home" color={color} size={size} />
                ),
                tabBarLabel: ({ color }) => (
                  <Text style={{ color, fontSize: 12, fontWeight: '500' }}>Home</Text>
                ),
              }}
            />
            <Tab.Screen 
              name="Calculator" 
              component={CalculatorScreen} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="calculator" color={color} size={size} />
                ),
                tabBarLabel: ({ color }) => (
                  <Text style={{ color, fontSize: 12, fontWeight: '500' }}>Calculator</Text>
                ),
              }}
            />
            <Tab.Screen 
              name="Records" 
              component={RecordsScreen} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="receipt" color={color} size={size} />
                ),
                tabBarLabel: ({ color }) => (
                  <Text style={{ color, fontSize: 12, fontWeight: '500' }}>Records</Text>
                ),
              }}
            />
            <Tab.Screen 
              name="Profile" 
              component={ProfileScreen} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person" color={color} size={size} />
                ),
                tabBarLabel: ({ color }) => (
                  <Text style={{ color, fontSize: 12, fontWeight: '500' }}>Profile</Text>
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
} 