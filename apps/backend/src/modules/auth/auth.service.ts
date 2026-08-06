import bcrypt from "bcryptjs";
import { UserRepository } from "../user/user.repository.js";
import { SignupDto, LoginDto } from "./auth.dto.js";
import {
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from "../../utils/exceptions.js";
import { generateTokens, verifyRefreshToken } from "../../utils/jwt.js";

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signup(dto: SignupDto) {
    const cleanEmail = dto.email.trim().toLowerCase();
    const existingUser = await this.userRepository.findByEmail(cleanEmail);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const newUser = await this.userRepository.create({
      name: dto.name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      tokenVersion: 0,
    });

    const tokens = generateTokens({
      userId: newUser._id.toString(),
      email: newUser.email,
      tokenVersion: newUser.tokenVersion,
    });

    return {
      user: {
        _id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString(),
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const cleanEmail = dto.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(cleanEmail);
    if (!user || !user.password) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      tokenVersion: user.tokenVersion,
    });

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      ...tokens,
    };
  }

  async refreshToken(refreshTokenString: string) {
    if (!refreshTokenString) {
      throw new UnauthorizedException("Refresh token missing");
    }

    try {
      const decoded = verifyRefreshToken(refreshTokenString);
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      // Refresh Token Reuse Detection & Revocation
      if (
        decoded.tokenVersion === undefined ||
        decoded.tokenVersion !== user.tokenVersion
      ) {
        // Invalidate all tokens for this user upon detecting reuse of an old/stolen token
        await this.userRepository.incrementTokenVersion(user._id.toString());
        throw new UnauthorizedException(
          "Refresh token reuse detected. Session revoked for security."
        );
      }

      // Refresh Token Rotation (RTR): Increment tokenVersion and issue a fresh pair
      const updatedUser = await this.userRepository.incrementTokenVersion(
        user._id.toString()
      );

      const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        tokenVersion: updatedUser?.tokenVersion ?? user.tokenVersion + 1,
      });

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw error;
      }
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async revokeUserSessions(userId: string) {
    await this.userRepository.incrementTokenVersion(userId);
  }
}
