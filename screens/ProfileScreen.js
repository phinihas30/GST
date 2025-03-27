import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Switch } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, Avatar, Divider, Portal, Dialog, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    business: 'ABC Trading',
    gstNumber: 'GST1234567890',
    phone: '+91 98765 43210',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({...userData});
  
  // Settings state
  const [themeDialogVisible, setThemeDialogVisible] = useState(false);
  const [notificationDialogVisible, setNotificationDialogVisible] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Load settings from AsyncStorage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load theme setting
        const themeSetting = await AsyncStorage.getItem('THEME_SETTING');
        if (themeSetting !== null) {
          setIsDarkTheme(themeSetting === 'dark');
        }
        
        // Load notification setting
        const notificationSetting = await AsyncStorage.getItem('NOTIFICATION_SETTING');
        if (notificationSetting !== null) {
          setNotificationsEnabled(notificationSetting === 'enabled');
        }
      } catch (error) {
        console.log('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const handleSave = () => {
    // In a real app, you would send this to an API
    setUserData({...editedData});
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData({...userData});
    setIsEditing(false);
  };
  
  const toggleTheme = async () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    
    try {
      // Save theme setting to AsyncStorage
      await AsyncStorage.setItem('THEME_SETTING', newTheme ? 'dark' : 'light');
      // In a real app, you would apply the theme change to the entire app
      Alert.alert('Theme Changed', `App theme set to ${newTheme ? 'Dark' : 'Light'} mode. This will be applied next time you restart the app.`);
    } catch (error) {
      console.log('Error saving theme setting:', error);
    }
    
    setThemeDialogVisible(false);
  };
  
  const toggleNotifications = async () => {
    const newSetting = !notificationsEnabled;
    setNotificationsEnabled(newSetting);
    
    try {
      // Save notification setting to AsyncStorage
      await AsyncStorage.setItem('NOTIFICATION_SETTING', newSetting ? 'enabled' : 'disabled');
      // In a real app, you would register/unregister for push notifications
      Alert.alert('Notifications', `Notifications ${newSetting ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.log('Error saving notification setting:', error);
    }
    
    setNotificationDialogVisible(false);
  };
  
  const handleLogout = async () => {
    try {
      // Clear user data but preserve settings
      // In a real app with authentication, you would clear the auth token here
      Alert.alert('Signed Out', 'You have been signed out successfully');
    } catch (error) {
      console.log('Error signing out:', error);
    }
    
    setLogoutDialogVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBanner}>
          <Avatar.Icon size={80} icon="account" style={styles.avatar} />
          <Title style={styles.title}>{userData.name}</Title>
          <Paragraph style={styles.subtitle}>{userData.business}</Paragraph>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title>User Information</Title>
            <Divider style={styles.divider} />
            {isEditing ? (
              <View>
                <TextInput
                  label="Name"
                  value={editedData.name}
                  onChangeText={text => setEditedData({...editedData, name: text})}
                  style={styles.input}
                />
                <TextInput
                  label="Email"
                  value={editedData.email}
                  onChangeText={text => setEditedData({...editedData, email: text})}
                  style={styles.input}
                  keyboardType="email-address"
                />
                <TextInput
                  label="Business Name"
                  value={editedData.business}
                  onChangeText={text => setEditedData({...editedData, business: text})}
                  style={styles.input}
                />
                <TextInput
                  label="GST Number"
                  value={editedData.gstNumber}
                  onChangeText={text => setEditedData({...editedData, gstNumber: text})}
                  style={styles.input}
                />
                <TextInput
                  label="Phone"
                  value={editedData.phone}
                  onChangeText={text => setEditedData({...editedData, phone: text})}
                  style={styles.input}
                  keyboardType="phone-pad"
                />
                <View style={styles.buttonContainer}>
                  <Button 
                    mode="outlined" 
                    onPress={handleCancel} 
                    style={styles.button}
                  >
                    Cancel
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={handleSave} 
                    style={styles.button}
                  >
                    Save
                  </Button>
                </View>
              </View>
            ) : (
              <View>
                <View style={styles.infoRow}>
                  <Paragraph style={styles.infoLabel}>Name:</Paragraph>
                  <Paragraph>{userData.name}</Paragraph>
                </View>
                <View style={styles.infoRow}>
                  <Paragraph style={styles.infoLabel}>Email:</Paragraph>
                  <Paragraph>{userData.email}</Paragraph>
                </View>
                <View style={styles.infoRow}>
                  <Paragraph style={styles.infoLabel}>Business:</Paragraph>
                  <Paragraph>{userData.business}</Paragraph>
                </View>
                <View style={styles.infoRow}>
                  <Paragraph style={styles.infoLabel}>GST Number:</Paragraph>
                  <Paragraph>{userData.gstNumber}</Paragraph>
                </View>
                <View style={styles.infoRow}>
                  <Paragraph style={styles.infoLabel}>Phone:</Paragraph>
                  <Paragraph>{userData.phone}</Paragraph>
                </View>
                <Button 
                  mode="contained" 
                  icon="pencil"
                  onPress={() => setIsEditing(true)}
                  style={styles.editButton}
                >
                  Edit Profile
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>App Settings</Title>
            <Divider style={styles.divider} />
            <Button 
              mode="outlined" 
              icon="theme-light-dark"
              style={styles.settingsButton}
              onPress={() => setThemeDialogVisible(true)}
            >
              App Theme
            </Button>
            <Button 
              mode="outlined" 
              icon="bell-outline"
              style={styles.settingsButton}
              onPress={() => setNotificationDialogVisible(true)}
            >
              Notifications
            </Button>
            <Button 
              mode="outlined" 
              icon="logout"
              style={styles.settingsButton}
              color={colors.error}
              onPress={() => setLogoutDialogVisible(true)}
            >
              Sign Out
            </Button>
          </Card.Content>
        </Card>
        
        {/* Theme Dialog */}
        <Portal>
          <Dialog visible={themeDialogVisible} onDismiss={() => setThemeDialogVisible(false)}>
            <Dialog.Title>App Theme</Dialog.Title>
            <Dialog.Content>
              <List.Item
                title="Light Theme"
                left={props => <List.Icon {...props} icon="white-balance-sunny" />}
                right={() => <Switch value={!isDarkTheme} onValueChange={toggleTheme} />}
              />
              <List.Item
                title="Dark Theme"
                left={props => <List.Icon {...props} icon="moon-waning-crescent" />}
                right={() => <Switch value={isDarkTheme} onValueChange={toggleTheme} />}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setThemeDialogVisible(false)}>Close</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        
        {/* Notifications Dialog */}
        <Portal>
          <Dialog visible={notificationDialogVisible} onDismiss={() => setNotificationDialogVisible(false)}>
            <Dialog.Title>Notifications</Dialog.Title>
            <Dialog.Content>
              <List.Item
                title="Enable Notifications"
                description="Receive important updates and reminders"
                left={props => <List.Icon {...props} icon="bell" />}
                right={() => <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setNotificationDialogVisible(false)}>Close</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        
        {/* Logout Dialog */}
        <Portal>
          <Dialog visible={logoutDialogVisible} onDismiss={() => setLogoutDialogVisible(false)}>
            <Dialog.Title>Sign Out</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Are you sure you want to sign out?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setLogoutDialogVisible(false)}>Cancel</Button>
              <Button onPress={handleLogout} color={colors.error}>Sign Out</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 0,
    paddingBottom: 30,
  },
  headerBanner: {
    backgroundColor: '#0d6efd',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  divider: {
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    minWidth: 100,
  },
  editButton: {
    marginTop: 16,
  },
  input: {
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  settingsButton: {
    marginVertical: 8,
  },
});

export default ProfileScreen; 