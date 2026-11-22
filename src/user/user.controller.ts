import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserRepository } from './user.repository.js';
import { CurrentUser } from '@nestjs/authentication';
import { UserPolicy } from './user.policy.js';
import { AuthorizationService, Can } from '@nestjs/authorization';
import { type UserInterface } from './user.interface.js';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthorizationService,
    private readonly userService: UserRepository
  ) {}

  @Get('id/:id')
  @Can.Anyone()
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get('email/:email')
  @Can.Anyone()
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Patch(':id')
  @Can(UserPolicy, 'modify', (context) => [context.switchToHttp().getRequest().params.userId])
  async updateUser(@CurrentUser() currentUser: UserInterface, @Param('id') id: string) {
    await this.authService.authorize(UserPolicy, 'modify', currentUser, id);
    //todo
  }

  @Delete(':id')
  @Can(UserPolicy, 'modify', (context) => [context.switchToHttp().getRequest().params.userId])
  async deleteUser(@CurrentUser() currentUser: UserInterface, @Param('id') id: string) {
    await this.authService.authorize(UserPolicy, 'modify', currentUser, id);
    //todo
  }
}
