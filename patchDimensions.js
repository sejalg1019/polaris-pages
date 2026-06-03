import { Dimensions, Keyboard } from 'react-native';

if (Dimensions.removeEventListener == null) {
  Dimensions.removeEventListener = () => {};
}

if (Keyboard.removeListener == null) {
  Keyboard.removeListener = () => {};
}