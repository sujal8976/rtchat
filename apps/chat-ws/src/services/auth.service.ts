import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export class AuthService {
  static async validateToken(token: string): Promise<string | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded.userId;
    } catch (error) {
      return null;
    }
  }
}
