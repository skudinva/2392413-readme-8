import { AuthUser, Entity, StorableEntity } from '@project/shared/core';
import { compare, genSalt, hash } from 'bcrypt';
import { SALT_ROUNDS } from './blog-user.constant';

export class BlogUserEntity extends Entity implements StorableEntity<AuthUser> {
  public email!: string;
  public name!: string;
  public avatar!: string;
  public registerDate!: Date;
  public passwordHash!: string;
  public subscribersCount!: number;
  public postsCount!: number;
  public subscriptions!: string[];

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
    this.subscriptions = user.subscriptions;
    this.subscribersCount = user.subscribersCount ?? 0;
    this.postsCount = user.postsCount ?? 0;
  }

  toPOJO(): AuthUser {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
      registerDate: this.registerDate,
      passwordHash: this.passwordHash,
      subscriptions: this.subscriptions,
      subscribersCount: this.subscribersCount,
      postsCount: this.postsCount,
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
