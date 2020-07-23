type ProviderUserInfo = {
  providerId: string;
  rawId: string;
  phoneNumber: string;
};

export type User = {
  localId: string;
  createdAt: string;
  validSince: string;
  disabled: boolean;
  email?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  providerUserInfo?: ProviderUserInfo[];
};

export type UserWithEmail = User & {
  email: string;
  emailVerified: boolean;
};

export type UserWithPhoneNumber = User & {
  phoneNumber: string;
  providerUserInfo: ProviderUserInfo[];
};
