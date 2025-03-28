export type TUser = {
  isAuthenticated: boolean;
  user: {
    _id?: string;
    username?: string;
    email?: string;
    fullname?: string;
    profilePicture?: string;
  };
};
