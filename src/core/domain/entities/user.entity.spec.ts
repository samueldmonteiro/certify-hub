import { describe, it, expect } from 'vitest';
import { User } from './user.entity';
import { randomUUID } from 'node:crypto';

describe('User Entity (Unit)', () => {
  it('should create a user entity with correct props', () => {

    const user = new User({
      id: randomUUID(),
      email: 'test@email.com',
      name: 'test',
      password: '12345',
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@email.com');
    expect(user.name).toBe('test');
    expect(user.getPassword()).toBe('12345');
  });

  it('should change password', () => {
    const user = new User({
      id: randomUUID(),
      email: 'test@email.com',
      name: 'test',
      password: '12345',
    });

    user.changePassword('change-password');

    expect(user.getPassword()).toBe('change-password');
  });

  it('should validate change password', () => {
    const user = new User({
      id: randomUUID(),
      email: 'test@email.com',
      name: 'test',
      password: '12345',
    });

    expect(() => {
      user.changePassword('123');
    }).toThrow('Senha deve conter mais de 5 caracteres');
  });

  it('should change name', () => {
    const user = new User({
      id: randomUUID(),
      email: 'test@email.com',
      name: 'test',
      password: '12345',
    });

    user.changeName('teste1');

    expect(user.name).toBe('teste1');
  });


  it('should validate change name', () => {
    const user = new User({
      id: randomUUID(),
      email: 'test@email.com',
      name: 'test',
      password: '12345',
    });

    expect(() => {
      user.changeName('te');
    }).toThrow('Nome deve conter mais de 3 caracteres');
  });

  it('should serialize without exposing password (toJSON)', () => {
    const user = new User({
      id: randomUUID(),
      email: 'test@email.com',
      name: 'test',
      password: '12345',
    });

    const json = user.toJSON();

    expect(json).toEqual({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    expect(json).not.toHaveProperty('password');
  });

  it('should throw InvalidCredentialsError when invalid name', async () => {

    expect(() => {
      new User({
        id: randomUUID(),
        email: 'test@email.com',
        name: 't',
        password: '123456',
      });
    }).toThrow('Nome deve conter mais de 3 caracteres');
  });

  it('should throw InvalidCredentialsError when invalid password', async () => {

    expect(() => {
      new User({
        id: randomUUID(),
        email: 'test@email.com',
        name: 'test',
        password: '12',
      });
    }).toThrow('Senha deve conter mais de 5 caracteres');
  });
});