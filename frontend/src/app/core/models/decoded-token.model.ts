export interface DecodedToken {
  email: string;
  firstName: string;
  lastName: string;
  exp: number;
  profilePhoto: string;

  [key: string]: any; // مهم عشان ال claims الطويلة
}