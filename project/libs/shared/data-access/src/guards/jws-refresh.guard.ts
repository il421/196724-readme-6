import { AuthGuard } from '@nestjs/passport';
import { Strategies } from '../strategies';

export class JwtRefreshGuard extends AuthGuard(Strategies.JwtRefresh) {}
