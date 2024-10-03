export class AuthResponse {
  constructor(
    public id: string,
    public email: string,
    public accessToken: string,
    public refreshToken: string,
  ) {}
}


