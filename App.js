import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import Recipe from './src/screens/Recipe';

export default function App() {
  // Load the custom fonts
  const [fontsLoaded] = useFonts({
    'Primary-Regular': require('./assets/fonts/Zain/Zain-Regular.ttf'),
    'Primary-Bold': require('./assets/fonts/Zain/Zain-Bold.ttf'),
    'Primary-ExtraBold': require('./assets/fonts/Zain/Zain-ExtraBold.ttf'),
  });

  // If fonts are not loaded, show a loading spinner
  if (!fontsLoaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Recipe/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding:5,
    backgroundColor:'white',  
  },
});
