import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import styles from './styles.js';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={[styles.box, { backgroundColor: '#e93e43', flex: 1 }]}>
        <Text style={styles.text}>1</Text>
      </View>
      <View style={[styles.box, { backgroundColor: '#f5a941', flex: 2 }]}>
        <Text style={styles.text}>2</Text>
      </View>
      <View style={[styles.box, { backgroundColor: '#4ebd7a', flex: 3 }]}>
        <Text style={styles.text}>3</Text>
      </View>
    </View>
  );
}
