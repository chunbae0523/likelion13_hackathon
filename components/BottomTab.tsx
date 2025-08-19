// components/BottomTab.tsx
import React from 'react';
import { View, Pressable, Text, StyleSheet, Platform } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomTab({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          const iconName =
            options.tabBarIcon
              ? // @ts-ignore expo-router passes a function; we fake-call it to get icon name
                (options as any).tabBarIcon({ color: isFocused ? '#F36B3B' : '#9CA3AF', size: 22, focused: isFocused }).props.name
              : 'ellipse-outline';

          return (
            <Pressable key={route.key} onPress={onPress} style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}>
              <Ionicons name={iconName as any} size={22} color={isFocused ? '#F36B3B' : '#9CA3AF'} />
              <Text style={[styles.label, { color: isFocused ? '#F36B3B' : '#9CA3AF' }]}>{label as string}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    ...Platform.select({ android: { elevation: 8 } }),
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  label: { fontSize: 11, fontWeight: '700' },
});
