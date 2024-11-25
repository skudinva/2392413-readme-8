import { AuthUser, Entity, StorableEntity } from '@project/shared/core';
import { compare, genSalt, hash } from 'bcrypt';
import { SALT_ROUNDS } from './blog-user.constant';

export class BlogUserEntity extends Entity implements StorableEntity<AuthUser> {
  public email!: string;
  public name!: string;
  public avatar!: string;
  public registerDate!: Date;
  public passwordHash!: string;

  constructor(user?: AuthUser) {
    super();
    this.populate(user);
  }
  public populate(user?: AuthUser): void {
    if (!user) {
      return;
    }
    const { id, email, name, avatar, registerDate, passwordHash } = user;

    this.id = id ?? '';
    this.email = email;
    this.name = name;
    this.avatar = avatar ?? '';
    this.registerDate = registerDate;
    this.passwordHash = passwordHash;
  }

  toPOJO(): AuthUser {
    const { id, email, name, avatar, registerDate, passwordHash } = this;

    return {
      id,
      email,
      name,
      avatar,
      registerDate,
      passwordHash,
    };
  }

  public async setPassword(password: string): Promise<BlogUserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }
}
