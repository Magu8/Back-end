import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersDto } from './dto/users.dto/users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async registerUser(body: UsersDto): Promise<any> {
    try {
      const { username } = body; //desestructuramos el username del body
      const existingUser = await this.userModel.findOne({ username }).lean(); //en existingUser guardaremos el objeto entero que coincida con el username indicado
      console.log(existingUser);
      if (!existingUser) {
        await this.userModel.create(body);
        return { message: 'User has been registered!', status: 201 };
      }
      return { message: 'User already exists', status: 409 };
    } catch (e) {
      return { message: `Error ${e}`, status: 500 };
    }
  }

  async addBio(username: string, body: any): Promise<any> {
    try {
      const updatedUser = await this.userModel
        .findOneAndUpdate(
          { username },
          { $set: { bio: body.bio } },
          { new: true }, // Devuelve el documento actualizado
        )
        .lean();

      if (!updatedUser) {
        return 'No user found. But you can create an account with this name';
      }

      return updatedUser.bio;
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      return `An error occurred: ${error}`;
    }
  }

  async findUser(username: any): Promise<any> {
    let user = await this.userModel.findOne({ username }).lean();
    if (!user) {
      return 'No user found. But you can create an account with this name';
    }
    return user;
  }

  async addFollowing(activeUser: any, userToFollow: any): Promise<any> {
    let active = await this.userModel.findOne({ username: activeUser });
    if (!active) {
      return 'No user found. But you can create an account with this name';
    }
    let follow = await this.userModel.findOne({ username: userToFollow });
    if (!follow) {
      return 'No user found. But you can create an account with this name';
    }

    active.following.push(follow.username);
    follow.followers.push(active.username);

    await active.save();
    await follow.save();

    let lastFollow = active.following[active.following.length - 1];

    return lastFollow;
  }

  async removeFollowing(activeUser: any, userToUnfollow: any): Promise<any> {
    let active = await this.userModel.findOneAndUpdate(
      { username: activeUser },
      { $pull: { following: userToUnfollow } },
      { new: true },
    );
    if (!active) {
      return 'no active';
    }
    let unfollow = await this.userModel.findOneAndUpdate(
      {
        username: userToUnfollow,
      },
      { $pull: { followers: activeUser } },
      { new: true },
    );
    if (!unfollow) {
      return 'cant unfollow';
    }

    await active.save();
    await unfollow.save();

    return active.following;
  }

  async getUserProfile(username: any): Promise<any> {
    let user = await this.userModel.findOne({ username }).lean();

    let { password, ...data } = user;

    return data;
  }

  //esto es exclusivo para el JWT
  async getUserDetails(username: any): Promise<any> {
    let details = await this.userModel.findOne({ username }).lean();

    let { password, ...results } = details;

    return results;
  }
}
