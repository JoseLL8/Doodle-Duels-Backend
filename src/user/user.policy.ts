import { Policy } from '@nestjs/authorization';
import { Role, UserInterface } from './user.interface.js';

@Policy()
export class UserPolicy {
  //superadmin has access to all endpoints
  before(user: UserInterface | null) {
    if (user?.role === Role.SUPERADMIN)
        return true;
  }

  //only for superadmin
  create(user: UserInterface | null) {
    return false;
  }

  //users can view everyone else
  view(user: UserInterface | null) {
    if (user)
        return true;
  }

  //users can only update and delete themselves
  modify(user: UserInterface | null, targetId: string) {
    return user?.id === targetId;
  }
}
