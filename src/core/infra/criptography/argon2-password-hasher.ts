import { PasswordHasher } from '../../domain/criptography/password-hasher';
import argon2 from 'argon2';

export class Argon2PasswordHasher implements PasswordHasher {

  async hasher(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async compare(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}