import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ArtworksService } from './artworks.service';
import { ArtworksDto } from './dto/artworks.dto/artworks.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('artworks')
export class ArtworksController {
  constructor(private readonly artworksService: ArtworksService) {}

  @Get('/')
  async artworks(): Promise<any> {
    return await this.artworksService.getArtworks();
  }

  @Get(':id')
  async artworkInfo(@Param('id') _id: string): Promise<any> {
    return await this.artworksService.getArtworkInfo(_id);
  }

  @Get(':username/own')
  async ownArtworks(@Param('username') username: string): Promise<any> {
    return await this.artworksService.getMyArtworks(username);
  }

  @Get(':username/byAuthor')
  async byAuthor(@Param('username') username: string): Promise<any> {
    return await this.artworksService.getByAuthor(username);
  }

  @Get(':username/myFave')
  async getfaveArtworks(
    @Param('username') username: string,
    @Param('id') _id: string,
  ): Promise<any> {
    return await this.artworksService.getMyFaveWorks(username);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':username/import')
  async importArtwork(
    @Param('username') username: string,
    @Body() body: ArtworksDto,
  ): Promise<any> {
    return await this.artworksService.submitArtwork(username, body);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':username/addComment/:id')
  async comment(
    @Param('username') username: string,
    @Body() body: any,
    @Param('id') _id: string,
  ): Promise<any> {
    return await this.artworksService.addComment(username, body, _id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':username/addToFav/:id')
  async favArtwork(
    @Param('username') username: string,
    @Param('id') _id: string,
  ): Promise<any> {
    return await this.artworksService.addFaveArtwork(username, _id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':username/removeFromFav/:id')
  async removefavArtwork(
    @Param('username') username: string,
    @Param('id') _id: string,
  ): Promise<any> {
    return await this.artworksService.removeFaveArtwork(username, _id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Put(':username/edit/:id')
  // async editArtwork(
  //   @Param('username') username: string,
  //   @Param('id') _id: string,
  //   @Body() body: ArtworksDto,
  // ): Promise<any> {
  //   return await this.artworksService.editArtwork(username, _id, body);
  // }
  @UseGuards(JwtAuthGuard)
  @Delete(':username/delete/:id')
  async eraseArtwork(
    @Param('username') username: string,
    @Param('id') _id: string,
  ): Promise<any> {
    return await this.artworksService.deleteArtwork(username, _id);
  }
}
