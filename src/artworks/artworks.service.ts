import { Injectable, NotFoundException } from '@nestjs/common';
import { Artwork, ArtworkDocument } from './artwork.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';
import { ArtworksDto } from './dto/artworks.dto/artworks.dto';

@Injectable()
export class ArtworksService {
  constructor(
    @InjectModel(Artwork.name) private artworkModel: Model<ArtworkDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getArtworks(): Promise<any> {
    try {
      return await this.artworkModel.find({ available: true }).exec();
    } catch (e) {
      `this error happened ${e}`;
    }
  }

  async getByAuthor(username: string): Promise<any> {
    try {
      let user = await this.userModel.findOne({ username });
      if (!user) {
        return "User doesn't exist";
      }

      return await this.artworkModel.find({ author: username });
    } catch (e) {
      `this error happened ${e}`;
    }
  }

  async getArtworkInfo(_id: string): Promise<any> {
    try {
      return await this.artworkModel.findById(_id);
    } catch (e) {
      `this error happened ${e}`;
    }
  }

  async getMyArtworks(username: string): Promise<any> {
    try {
      let user = await this.userModel.findOne({ username });
      if (!user) {
        return "User doesn't exist";
      }

      console.log(user.own);
      return user.own;
    } catch (e) {
      `this error happened ${e}`;
    }
  }

  async getMyFaveWorks(username: string): Promise<any> {
    try {
      let user = await this.userModel.findOne({ username });
      if (!user) {
        return "User doesn't exist";
      }
      return user.fav;
    } catch (e) {
      `this error happened ${e}`;
    }
  }

  async submitArtwork(username: string, body: ArtworksDto): Promise<any> {
    try {
      let user = await this.userModel.findOne({ username });
      if (!user) {
        return "User doesn't exist";
      }

      body.description = body.description || 'No description';

      let artwork = await this.artworkModel.create({
        ...body,
        author: username,
        available: true,
      });

      user.own.push(artwork._id);
      await user.save();
      console.log(user.own);

      let submitedId = user.own[user.own.length - 1];

      return submitedId;
    } catch (e) {
      `this error happened ${e}`;
    }
  }

  async addComment(username: string, body: any, _id: string): Promise<any> {
    try {
      let user = await this.userModel.findOne({ username });
      if (!user) {
        return "User doesn't exist";
      }
      let artwork = await this.artworkModel.findById(_id);
      if (!artwork) {
        return "Artwork doesn't exist";
      }

      artwork.comments.push({
        u: user.username,
        comment: body.comment,
        pic: user.photo,
      });
      await artwork.save();

      return artwork.comments[artwork.comments.length - 1];
    } catch (e) {
      `this error happened ${e}`;
    }
  }

  async addFaveArtwork(username: string, _id: string): Promise<any> {
    try {
      let user = await this.userModel.findOne({ username });
      if (!user) {
        return "User doesn't exist";
      }

      let artwork = await this.artworkModel.findById(_id);

      if (user.username === artwork.author) {
        return "Hey, you can't add your own artwork to faves";
      }

      user.fav.push(artwork._id);
      await user.save();
      console.log(user.fav);

      let faveId = user.fav[user.fav.length - 1];

      return faveId;
    } catch (e) {
      `this error happened ${e}`;
    }
  }

  async removeFaveArtwork(username: string, _id: string): Promise<any> {
    try {
      let artwork = await this.artworkModel.findById(_id);
      if (!artwork) {
        return "Artwork doesn't exist";
      }
      let user = await this.userModel.findOneAndUpdate(
        { username },
        { $pull: { fav: artwork._id } },
        { new: true },
      );
      if (!user) {
        return "User doesn't exist";
      }
      return user.fav;
    } catch (e) {
      `this error happened ${e}`;
    }
  }

  async deleteArtwork(username: string, _id: string): Promise<any> {
    try {
      let user = await this.userModel.findOne({ username });
      if (!user) {
        return "User doesn't exist";
      }

      let artwork = await this.artworkModel.findById(_id);

      if (user.username !== artwork.author) {
        return "Hey! You can't delete an artwork that doesn't belong to you.";
      }

      await this.artworkModel.findByIdAndDelete(_id);

      user.own = user.own.filter((thisId) => thisId.toString() !== _id); //el toString es necesario porque el _id que tienen los objetos de moongose no son simples strings, mientras que lo que recibimos por párametros sí que lo son, por mucho que los números sean exactamente los mismos. Por eso tenemos que convertir el elemento _id en string para que sea posible la eliminación
      await user.save();
      return `Artwork successfully deleted, what a shame ${user.name}...`;
    } catch (e) {
      `this error happened ${e}`;
    }
  }

  async editArtwork(
    username: string,
    _id: string,
    body: ArtworksDto,
  ): Promise<any> {
    try {
      let user = await this.userModel.findOne({ username });
      if (!user) {
        return "User doesn't exist";
      }

      let existingArtwork = await this.artworkModel.findById(_id);
      if (!existingArtwork) {
        return "Artwork doesn't exist";
      } else if (existingArtwork.author !== user.username) {
        return "Hey! You can't edit an artwork that doesn't belong to you!";
      }

      await this.artworkModel.findByIdAndUpdate(_id, {
        ...existingArtwork.toObject(),
        ...body,
      }); //lo que hacemos aquí, es que por id encuentra su respectivo objeto, y se actualiza por el indicado en el body
      const updatedArtwork = await this.artworkModel.findById(_id);
      console.log(updatedArtwork);

      return `Artwork successfully updated ${user.name}!`;
    } catch (e) {
      `this error happened ${e}`;
    }
  }
}
