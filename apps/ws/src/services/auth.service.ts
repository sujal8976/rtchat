import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export class AuthService {
  static async validateToken(token: string): Promise<{ userId: string; username: string } | null> {
    try {
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
