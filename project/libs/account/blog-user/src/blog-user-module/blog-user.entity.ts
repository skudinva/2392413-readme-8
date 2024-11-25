import { AuthUser, Entity, StorableEntity } from '@project/shared/core';

export class BlogUserEntity extends Entity implements StorableEntity<AuthUser> {
  public email?: string;
  public name?: string;
  public avatar?: string;
  public registerDate?: Date;
  public passwordHash?: string;

  constructor(user?: AuthUser) {
    super();
    this.populate(user);
  }
  public populate(user?: AuthUser): void {
    if (!user) {
      return;
    }
    this.id = user.id ?? '';
    this.email = user.email;
    this.name = user.name;
    this.avatar = user.avatar ?? '';
    this.registerDate = user.registerDate;
    this.passwordHash = user.passwordHash;
  }

  toPOJO(): AuthUser {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
      registerDate: this.registerDate,
      passwordHash: this.passwordHash,
    };
  }
}
