import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: 'person-outline',
          title: 'Profile Settings',
          subtitle: 'Update your profile information',
          action: () => Alert.alert('Profile Settings', 'Navigate to profile settings'),
        },
        {
          icon: 'lock-closed-outline',
          title: 'Change Password',
          subtitle: 'Update your account password',
          action: () => Alert.alert('Change Password', 'Navigate to password change'),
        },
        {
          icon: 'notifications-outline',
          title: 'Notifications',
          subtitle: 'Manage notification preferences',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
      ],
    },
    {
      title: 'App Settings',
      items: [
        {
          icon: 'moon-outline',
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          icon: 'sync-outline',
          title: 'Auto Sync',
          subtitle: 'Automatically sync data',
          type: 'switch',
          value: autoSync,
          onValueChange: setAutoSync,
        },
        {
          icon: 'language-outline',
          title: 'Language',
          subtitle: 'English',
          action: () => Alert.alert('Language', 'Select language'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          action: () => Alert.alert('Help & Support', 'Navigate to help center'),
        },
        {
          icon: 'document-text-outline',
          title: 'Terms of Service',
          subtitle: 'Read our terms of service',
          action: () => Alert.alert('Terms of Service', 'View terms of service'),
        },
        {
          icon: 'shield-checkmark-outline',
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          action: () => Alert.alert('Privacy Policy', 'View privacy policy'),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'information-circle-outline',
          title: 'App Version',
          subtitle: 'Version 1.0.0',
          action: null,
        },
        {
          icon: 'log-out-outline',
          title: 'Sign Out',
          subtitle: 'Sign out of your account',
          action: () => Alert.alert('Sign Out', 'Are you sure you want to sign out?'),
        },
      ],
    },
  ];

  const renderSettingItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.settingItem}
      onPress={item.action}
      disabled={!item.action}
    >
      <View style={styles.settingIcon}>
        <Ionicons name={item.icon} size={24} color="#666" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onValueChange}
          trackColor={{ false: '#ddd', true: '#1976d2' }}
          thumbColor={item.value ? '#fff' : '#f4f3f4'}
        />
      ) : (
        item.action && (
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        )
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => 
              renderSettingItem(item, itemIndex)
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 20,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default SettingsScreen; 