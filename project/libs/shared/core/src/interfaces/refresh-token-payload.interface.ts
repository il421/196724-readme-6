import { ITokenPayload } from './token-payload.interface';

export interface IRefreshTokenPayload extends ITokenPayload {
  tokenId: string;
}
