import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategies } from '../strategies';

@Injectable()
export class JwtAuthGuard extends AuthGuard(Strategies.Jwt) {}
