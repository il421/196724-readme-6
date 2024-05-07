import { AuthGuard } from '@nestjs/passport';
import { Strategies } from '../strategies';

export class LocalAuthGuard extends AuthGuard(Strategies.Local) {}
