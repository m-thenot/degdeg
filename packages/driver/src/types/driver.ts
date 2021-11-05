interface IDriver {
  phoneNumber: string | null;
  uid: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  tokens?: string[];
  image?: string;
}
