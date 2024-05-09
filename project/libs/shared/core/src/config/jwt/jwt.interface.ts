export interface IJwtConfig {
  accessTokenSecret: string;
  accessTokenExpiresIn: string;

  refreshTokenSecret: string;
  refreshTokenExpiresIn: string;
}
