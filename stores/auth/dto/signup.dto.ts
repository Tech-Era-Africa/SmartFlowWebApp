export interface SignupDTO {
  user: {
    org: {
      id: string;
    };
    role: {
      id: string;
    };
    first_name: string;
    last_name: string;
    email: string;
  };
  password: string;
}
