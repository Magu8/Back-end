import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users/users.controller';
import { ArtworksModule } from './artworks/artworks.module';
import { ArtworksController } from './artworks/artworks.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    ArtworksModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/Gallery'),
    AuthModule,
  ],
  controllers: [AppController, UsersController, ArtworksController],
  providers: [AppService],
})
export class AppModule {}
