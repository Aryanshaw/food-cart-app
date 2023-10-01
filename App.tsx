import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ProductsPage from './src/screens/ProductsPage/ProductsPage';
import { Provider } from 'react-redux';
import store from './utils/store/store';

export default function App() {
  return (
    <Provider store={store}>
    <View style={styles.container}>
      <ProductsPage/>
      <StatusBar style="auto" />
    </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
