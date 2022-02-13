import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';

export const storeStringData = async (value: string, key: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e: any) {
    crashlytics().recordError(e);
  }
};

export const storeObjectData = async (value: any, key: string) => {
  try {
    const jsonValue = JSON.stringify(value);

    await AsyncStorage.setItem(key, jsonValue);
  } catch (e: any) {
    crashlytics().recordError(e);
  }
};

export const getStringData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value !== null) {
      return value;
    }
  } catch (e: any) {
    crashlytics().recordError(e);
  }
};

export const getObjectData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value !== null) {
      return value;
    }
  } catch (e: any) {
    crashlytics().recordError(e);
  }
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e: any) {
    crashlytics().recordError(e);
  }
};
