import crashlytics from '@react-native-firebase/crashlytics';

export class Logger {
  static log(message: any) {
    if (__DEV__) {
      console.log(message);
    } else {
      crashlytics().log(message);
    }
  }

  static error(error: any) {
    if (__DEV__) {
      console.error(error);
    } else {
      crashlytics().recordError(error);
    }
  }
}
