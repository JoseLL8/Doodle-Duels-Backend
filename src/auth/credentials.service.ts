import { ConflictException, Injectable } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { UserInterface } from '../user/user.interface.js';
import { UserRepository } from '../user/user.repository.js';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async register(email: string, password: string): Promise<UserInterface> {
    if (await this.userRepository.findByEmail(email)) {
      throw new ConflictException('Email already registered');
    }
    // The address is unverified: anyone can type any email into a sign-up form.
    const passwordHash = await this.passwordHasher.hash(password);
    return this.userRepository.create(email, passwordHash);
  }

  /** The user, or `null` when the email or the password is wrong. */
  async verify(email: string, password: string): Promise<UserInterface | null> {
    const found = await this.userRepository.findCredentials(email);
    // With no account (or no password), verify() checks a dummy hash, so the
    // response time does not reveal which emails are registered.
    const valid = await this.passwordHasher.verify(password, found?.passwordHash);
    if (!valid || !found?.passwordHash) {
      return null;
    }
    // The cost settings changed since this hash was stored: upgrade it now,
    // while we have the plaintext.
    if (this.passwordHasher.needsRehash(found.passwordHash)) {
      await this.userRepository.updatePasswordHash(found.user.id, await this.passwordHasher.hash(password));
    }
    return found.user;
  }
}
