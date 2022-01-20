export type AuthStackParamList = {
  start: undefined;
  signInWithPhoneNumber: undefined;
  verification: { phoneNumber: string };
  information: undefined;
  main: undefined;
};

export type PrebooksStackParamList = {
  list: {
    activeTab?: string;
  };
  detail: {
    orderId: string;
  };
};

export type DrawerNavigatorParamList = {
  home: undefined;
  history: undefined;
  wallet: undefined;
  my_information: undefined;
  help: undefined;
  user: undefined;
  prebooks: {
    orderId?: string;
    activeTab?: string;
  };
};
