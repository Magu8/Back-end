import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './dto/users.dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async createUser(@Body() body: UsersDto): Promise<any> {
    return await this.usersService.registerUser(body);
  }

  @Post(':username/bio')
  async bio(@Param('username') username: string, @Body() body: any): Promise <any>{
    return await this.usersService.addBio(username, body)
  }

  @Get('profile/:username')
  async profile(@Param('username') username: string): Promise<any> {
    return await this.usersService.getUserProfile(username);
  }

  @Put('follow/:activeUser/:userToFollow')
  async follow(
    @Param('activeUser') activeUser: string,
    @Param('userToFollow') userToFollow: string,
  ): Promise<any> {
    return await this.usersService.addFollowing(activeUser, userToFollow);
  }

  @Put('unfollow/:activeUser/:userToUnfollow')
  async removeFollow(
    @Param('activeUser') activeUser: string,
    @Param('userToUnfollow') userToUnfollow: string,
  ): Promise<any> {
    return await this.usersService.removeFollowing(activeUser, userToUnfollow);
  }
  
}
