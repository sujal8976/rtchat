import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export class AuthService {
  static async validateToken(token: string): Promise<string | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
      return decoded.sub;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
