import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

// Generate JWT token
export function generateToken(user: User): string {
  // TODO: Implement JWT token generation with jsonwebtoken
  // import jwt from 'jsonwebtoken';
  // return jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  
  // Mock token for now (replace with real JWT when ready)
  const payload = {
    userId: user.id,
    email: user.email,
    username: user.username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  };
  
  return `mock_token_${user.id}_${Date.now()}`;
}

// Verify JWT token
export function verifyToken(token: string): User | null {
  try {
    // TODO: Implement JWT token verification with jsonwebtoken
    // import jwt from 'jsonwebtoken';
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    // return decoded;
    
    // Mock verification for now - extract user ID from token
    if (token.startsWith('mock_token_')) {
      // Token format: mock_token_${userId}_${timestamp}
      const parts = token.split('_');
      if (parts.length >= 3) {
        const userId = parts[2]; // Get the user ID from the token
        return {
          id: userId,
          username: 'user123', // This will be fetched from database
          email: 'user@example.com', // This will be fetched from database
          createdAt: '2024-01-01T00:00:00.000Z' // This will be fetched from database
        };
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Get user from request headers
export function getUserFromRequest(request: NextRequest): User | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  return verifyToken(token);
}

// Hash password (for registration) - TEMPORARILY DISABLED
export async function hashPassword(password: string): Promise<string> {
  // TODO: Re-enable bcrypt hashing in production
  // const saltRounds = 12;
  // return await bcrypt.hash(password, saltRounds);
  
  // For testing: return plain password
  return password;
}

// Compare password (for login) - TEMPORARILY DISABLED
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  // TODO: Re-enable bcrypt comparison in production
  // return await bcrypt.compare(password, hashedPassword);
  
  // For testing: compare plain text
  return password === hashedPassword;
} 