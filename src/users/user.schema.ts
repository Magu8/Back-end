import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  photo: string;
  @Prop()
  name: string;
  @Prop({ unique: true })
  username: string;
  @Prop()
  password: string;
  @Prop({default: "No information about the user"})
  bio: string
  @Prop([{ type: Object }]) //esto indica que tanto own
  own: Array<any>;
  @Prop([{ type: Object }]) //como bought son arrays que guardarán objetos
  fav: Array<any>;
  @Prop({ default: [] })
  followers: string[];
  @Prop({ default: [] })
  following: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
