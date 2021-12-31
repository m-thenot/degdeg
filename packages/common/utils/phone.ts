import { Linking, Platform } from 'react-native';

export const callNumber = (phoneNumber: string) => {
  let phoneNumberLink =
    Platform.OS !== 'android'
      ? `telprompt:${phoneNumber}`
      : `tel:${phoneNumber}`;

  Linking.canOpenURL(phoneNumberLink)
    .then(supported => {
      if (supported) {
        return Linking.openURL(phoneNumberLink);
      }
    })
    .catch(err => console.error(err));
};
