import { injectable } from "tsyringe";
import User, { IUser } from "../Models/User";
import passport from "passport";
import { hash } from "../Utils/bcrypt";
import { acceptedRoleNames, Role } from "../Models/Role";
import CustomError from "../Utils/customError.model";
// import { ObjectId } from "mongoose";

@injectable()
export class UserService {
  public async createUser({
    name,
    googleId,
    email,
    password,
    profilePicture,
    facebookId,
  }: Partial<IUser>) {
    password = await hash(password as string);

    const newUser = new User({
      email,
      password,
      roles: [{ roleName: acceptedRoleNames.Guest }],
      selectedRole: acceptedRoleNames.Guest,
      name,
      googleId,
      profilePicture,
      facebookId,
    });

    await newUser.save();

    return newUser;
  }

  public async getUserById(_id: string): Promise<IUser | null> {
    const user = await User.findById(_id).select(["-password"]);

    if (!user) {
      throw new CustomError("User not found.", {
        statusCode: 404,
        isAuthenticated: false,
        isAuthorised: false,
      });
    }

    return user;
  }

  public async verifyAndSelectRole(role: string, { roles, _id }: IUser) {
    const roleExists = roles.some(
      (userRole: Role) => userRole.roleName === role
    );

    if (!roleExists) {
      throw new CustomError("Invalid role selection.", {
        statusCode: 400,
        isAuthorised: false,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { selectedRole: role },
      {
        new: true,
      }
    );

    return updatedUser;
  }
}
