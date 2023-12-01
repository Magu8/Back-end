import { IsNotEmpty, IsString } from 'class-validator';

export class ArtworksDto {
  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;
}
