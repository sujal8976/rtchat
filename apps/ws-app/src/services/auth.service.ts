import jwt from "jsonwebtoken";


export class AuthService {
  static async validateToken(token: string): Promise<{ userId: string; username: string } | null> {
    try {
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) throw new Error("JWT TOKEN is not provided")
      const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; username: string };
      return {
        userId: decoded.sub,
        username: decoded.username
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
