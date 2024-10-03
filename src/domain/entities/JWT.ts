/* eslint-disable @typescript-eslint/no-explicit-any */
export class RefreshAccessTokenResponse {
  constructor(
    public accessToken: string,
    public refreshToken: string,
  ) {}
}

export interface JWTPayload {
  [key: string]: any;
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
}
