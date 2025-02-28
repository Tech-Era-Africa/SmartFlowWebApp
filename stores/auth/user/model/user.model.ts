

export class UserModel {
  user: User;

  constructor(user: User) {
    const defaultAvatarUrl = `https://api.dicebear.com/6.x/initials/svg?seed=${user.firstName} ${user.lastName}`;

    if (!user.avatarUrl) {
      user.avatarUrl = defaultAvatarUrl;
    }
    
    this.user = user;
  }

  // Factory constructor
  static default(): UserModel {
    const user: User = {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      avatarUrl: ""
    };

    return new UserModel(user);
  }

  static fromMap(json: any) {
    const user: User = {
      id: json.id,
      firstName: json.first_name,
      lastName: json.last_name,
      email: json.email,
      avatarUrl: json.avatar_url
    };

    return user;
  }
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

