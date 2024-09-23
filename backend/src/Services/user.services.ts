import { injectable } from "tsyringe";
import User from "../Models/User";
import passport from "passport";
import { hash } from "../Utils/bcrypt";

@injectable()
export class UserService {
  public async getUsers() {
    const users = [{ id: 1, name: "bong" }];
    return users;
  }

  // public async loginUser() {}

  public async createUser(data: {
    name: string;
    email: string;
    password: string;
  }) {
    data.password = await hash(data.password);

    const newUser = new User({
      email: data.email,
      password: data.password,
      roles: [{}],
    });

    await newUser.save();

    return newUser.toObject();
  }
}
