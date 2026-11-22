import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { Role, UserInterface } from './user.interface.js';
import { randomUUID } from 'crypto';

@Injectable()
export class UserRepository {
  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(
    email: string,
    passwordHash: string
  ): Promise<UserInterface> {
    const row: User = { id: randomUUID(), email: normalize(email), emailVerified: false, role: Role.USER, passwordHash };
    return await this.userRepository.save(row);
  }

  async findById(id: string): Promise<UserInterface | null> {
    const row = await this.userRepository.findOneBy({ id });
    return row ? toUser(row) : null;
  }

  async findByEmail(email: string): Promise<UserInterface | null> {
    const row = await this.userRepository.findOneBy({ email });
    return row ? toUser(row) : null;
  }

  /** For password sign-in only. */
  async findCredentials(email: string): Promise<{ user: UserInterface; passwordHash: string } | null> {
    const row = await this.findRowByEmail(email);
    return row ? { user: toUser(row), passwordHash: row.passwordHash } : null;
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    const row = await this.findRowById(id);
    if (row) {
      row.passwordHash = passwordHash;
    }
  }

  async updateEmail(id: string, email: string): Promise<UserInterface | null> {
    const row = await this.findRowById(id);
    if (!row) {
      return null;
    }
    row.email = normalize(email);
    row.emailVerified = false; // nobody has proven the new address yet
    return toUser(row);
  }

  async findRowById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async findRowByEmail(email: string) {
    const normalized = normalize(email);
    return this.userRepository.findOneBy({ email: normalized });
  }

  async deleteById(id: string) {
    const row = await this.findRowById(id);
    if (!row) {
      return; //todo 404 error
    }
    return this.userRepository.remove(row);
  }
}

// As the package passes addresses to handlers: an accent typed as two code points matches the stored one.
const normalize = (email: string) => email.trim().normalize('NFC').toLowerCase();
const toUser = ({ id, email, emailVerified, role }: User): UserInterface => ({ id, email, emailVerified, role });
