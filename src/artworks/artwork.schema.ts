import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArtworkDocument = Artwork & Document;

@Schema()
export class Artwork {
  @Prop()
  image: string;

  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop()
  description: string;

  @Prop()
  available: boolean;

  @Prop([{ type: Object }])
  comments: Array<any>;
}

export const ArtworkSchema = SchemaFactory.createForClass(Artwork);
