import { Injectable } from '@nestjs/common';
import { AuthenticationRegistry, SessionCookieProvider, type SessionRecord } from '@nestjs/authentication';
import { UserRepository } from '../user/user.repository.js';
import { UserInterface } from '../user/user.interface.js';

@Injectable()
export class SessionAuth extends SessionCookieProvider<UserInterface> {
  constructor(
    private readonly userRepository: UserRepository,
    registry: AuthenticationRegistry,
  ) {
    super();
    // Adds this provider to the chain the guard runs for every request.
    registry.registerProvider(this);
  }

  // Called for every request with a live session cookie.
  // Returning null (the user was deleted) ends the session.
  async validate(session: SessionRecord) {
    return await this.userRepository.findById(session.userId);
  }
}
