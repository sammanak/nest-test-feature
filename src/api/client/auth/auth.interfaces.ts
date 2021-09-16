export interface JWTPayload {
  id: number;
  type: string;
  loginDate: string;
}
export interface UserPayload {
  id: number;
  type: string;
  email: string;
  phone: string;
  password: string;
  given_name: string;
  family_name: string;
  picture: string;
  sub: string;
}
