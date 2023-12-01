import { Module } from '@nestjs/common';
import { ArtworksController } from './artworks.controller';
import { ArtworksService } from './artworks.service';
import { Artwork, ArtworkSchema } from './artwork.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Artwork.name,
        schema: ArtworkSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [ArtworksController],
  providers: [ArtworksService],
  exports: [ArtworksService]
})
export class ArtworksModule {}
