

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
      objectId : "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      createdAt : ""

    };

    return new UserModel(user);
  }

  static fromMap(json:any) {
    const user: User = {
      objectId:json.objectId,
      firstName: json.firstname,
      lastName: json.lastname,
      email: json.email,
      avatarUrl : json.avatarUrl,
      role:json.role?.objectId,
      phoneNumber: "",
      createdAt : json.createdAt,

    };

    return user;
  }
}

export interface User {
  objectId:string;
  firstName: string;
  lastName: string;
  middleName?: string;
  fullName?: string;
  email: string;
  phoneNumber: string;
  joinDate?: Date;
  avatarUrl?: string;
  role?: string;
  createdAt?: any;
  isLink?:boolean;

}

