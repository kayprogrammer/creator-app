import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CampaignListScreen from '../screens/CampaignListScreen';
import CampaignDetailScreen from '../screens/CampaignDetailScreen';
import SubmissionsScreen from '../screens/SubmissionsScreen';
import { COLORS, RADIUS } from '../theme/tokens';
import { useSubmissions } from '../context/SubmissionsContext';

import { RootStackParamList, BottomTabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function TabBarIcon({ emoji, focused, badge }: { emoji: string; focused: boolean; badge?: number }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
      {badge !== undefined && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

function MainTabs() {
  const { submissions } = useSubmissions();
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="CampaignList"
        component={CampaignListScreen}
        options={{
          tabBarLabel: 'Campaigns',
          tabBarIcon: ({ focused }) => <TabBarIcon emoji="🏷️" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Submissions"
        component={SubmissionsScreen}
        options={{
          tabBarLabel: 'My Work',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon emoji="📊" focused={focused} badge={pendingCount} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="CampaignDetail"
          component={CampaignDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 94, // Increased from 80
    paddingTop: 10,
    paddingBottom: 24, // Increased from 20 to ensure labels have enough room
  },
  tabLabel: { 
    fontSize: 11, 
    fontWeight: '600', 
    marginTop: 4, // Slightly more space between icon and label
    marginBottom: 4,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { fontSize: 9, color: '#fff', fontWeight: '700' },
});
