import axios from 'axios';
import {addFlipperNetworkPlugin} from 'react-native-flipper';

const client = axios.create({
  baseURL: 'https://api.example.com',
});

if (__DEV__) {
  addFlipperNetworkPlugin(client); // ✅ 한 번만 설정!
}

export default client;
