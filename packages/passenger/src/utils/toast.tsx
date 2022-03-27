import { SimpleToast } from '@dagdag/common/components/SimpleToast';
import React from 'react';
import Toast from 'react-native-toast-message';

export enum ToastTypes {
  DG_SUCCESS = 'dg_success',
  DG_ERROR = 'dg_error',
}

export const ToastConfig = {
  dg_success: ({ props }) => (
    <SimpleToast type="success" message={props.message} />
  ),
  dg_error: ({ props }) => <SimpleToast type="error" message={props.message} />,
};

interface ISimpleToast {
  message: string;
}

type ToastOptions = ISimpleToast;

export default class DGToast {
  static show(type: ToastTypes, options: ToastOptions, visibilityTime = 3000) {
    Toast.show({
      type: type,
      props: options,
      visibilityTime: visibilityTime,
      autoHide: true,
    });
  }
}
