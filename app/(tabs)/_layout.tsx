// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomTab from '@/components/BottomTab';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTab {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: '홈', tabBarIcon: () => <Ionicons name="home-outline" /> }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: '커뮤니티', tabBarIcon: () => <Ionicons name="people-outline" /> }}
      />
      <Tabs.Screen
        name="map"
        options={{ title: '지도', tabBarIcon: () => <Ionicons name="map-outline" /> }}
      />
      <Tabs.Screen
        name="mypage"
        options={{ title: '마이페이지', tabBarIcon: () => <Ionicons name="person-circle-outline" /> }}
      />
    </Tabs>
  );
}
