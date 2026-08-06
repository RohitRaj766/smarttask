import crypto from "crypto";
import bcrypt from "bcryptjs";
import { UserRepository } from "../user/user.repository.js";
import {
  SignupDto,
  LoginDto,
  VerifyEmailDto,
  ResendOtpDto,
  ForgotPasswordDto,
  VerifyResetOtpDto,
  ResetPasswordDto,
} from "./auth.dto.js";
import { EmailVerificationModel } from "./schemas/email-verification.schema.js";
import { PasswordResetModel } from "./schemas/password-reset.schema.js";
import { notificationService } from "../notification/notification.service.js";
import { getVerifyEmailTemplate } from "../../templates/verify-email.js";
import { getForgotPasswordTemplate } from "../../templates/forgot-password.js";
import {
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from "../../utils/exceptions.js";
import { generateTokens, verifyRefreshToken } from "../../utils/jwt.js";

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);
const MAX_OTP_ATTEMPTS = 5;

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  private generateSecureOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

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

    // Generate 6-digit OTP
    const rawOtp = this.generateSecureOtp();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await EmailVerificationModel.deleteMany({ userId: newUser._id });
    await EmailVerificationModel.create({
      userId: newUser._id,
      otpHash: hashedOtp,
      expiresAt,
      attempts: 0,
      verified: false,
    });

    // Send Verification Email via NotificationService -> ResendProvider
    const emailHtml = getVerifyEmailTemplate(newUser.name, rawOtp);
    await notificationService.sendEmail(
      newUser.email,
      "Verify Your SmartTask Account OTP",
      emailHtml
    );

    console.log(`[OTP Generated] Email: ${newUser.email} | OTP: ${rawOtp}`);

    return {
      message:
        "Registration successful. Please check your email for the 6-digit verification OTP.",
      userId: newUser._id.toString(),
      email: newUser.email,
    };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const cleanEmail = dto.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(cleanEmail);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.isEmailVerified) {
      throw new BadRequestException("Email is already verified. You can log in.");
    }

    const record = await EmailVerificationModel.findOne({ userId: user._id });
    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException("Verification OTP expired or invalid. Please request a new one.");
    }

    const isMatch = await bcrypt.compare(dto.otp, record.otpHash);
    if (!isMatch) {
      record.attempts += 1;
      if (record.attempts >= MAX_OTP_ATTEMPTS) {
        await EmailVerificationModel.deleteOne({ _id: record._id });
        throw new BadRequestException(
          "Maximum verification attempts exceeded. Please request a new OTP."
        );
      }
      await record.save();
      throw new BadRequestException("Invalid verification OTP code.");
    }

    // Mark User as Email Verified
    user.isEmailVerified = true;
    await user.save();

    // Delete Verification Record
    await EmailVerificationModel.deleteOne({ _id: record._id });

    console.log(`[OTP Verified] Email: ${user.email}`);

    // Generate Session JWT Tokens upon successful verification
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
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      ...tokens,
    };
  }

  async resendOtp(dto: ResendOtpDto) {
    const cleanEmail = dto.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(cleanEmail);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.isEmailVerified) {
      throw new BadRequestException("Email is already verified. You can log in.");
    }

    const rawOtp = this.generateSecureOtp();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await EmailVerificationModel.deleteMany({ userId: user._id });
    await EmailVerificationModel.create({
      userId: user._id,
      otpHash: hashedOtp,
      expiresAt,
      attempts: 0,
      verified: false,
    });

    const emailHtml = getVerifyEmailTemplate(user.name, rawOtp);
    await notificationService.sendEmail(
      user.email,
      "Your New SmartTask Verification OTP",
      emailHtml
    );

    console.log(`[OTP Resent] Email: ${user.email} | OTP: ${rawOtp}`);

    return {
      message: "A new 6-digit verification OTP has been sent to your email address.",
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

    // Check Email Verification Status
    if (!user.isEmailVerified) {
      throw new ForbiddenException("Please verify your email address before logging in");
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
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      ...tokens,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const cleanEmail = dto.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(cleanEmail);
    if (!user) {
      // Do not reveal email existence to prevent user enumeration
      return {
        message: "If an account exists with this email, a password reset OTP has been sent.",
      };
    }

    const rawOtp = this.generateSecureOtp();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await PasswordResetModel.deleteMany({ userId: user._id });
    await PasswordResetModel.create({
      userId: user._id,
      otpHash: hashedOtp,
      expiresAt,
      attempts: 0,
      used: false,
    });

    const emailHtml = getForgotPasswordTemplate(user.name, rawOtp);
    await notificationService.sendEmail(
      user.email,
      "SmartTask Password Reset OTP Code",
      emailHtml
    );

    console.log(`[Forgot Password OTP Generated] Email: ${user.email} | OTP: ${rawOtp}`);

    return {
      message: "If an account exists with this email, a password reset OTP has been sent.",
    };
  }

  async verifyResetOtp(dto: VerifyResetOtpDto) {
    const cleanEmail = dto.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(cleanEmail);
    if (!user) {
      throw new BadRequestException("Invalid reset OTP code.");
    }

    const record = await PasswordResetModel.findOne({ userId: user._id, used: false });
    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException("Reset OTP code expired or invalid. Please request a new one.");
    }

    const isMatch = await bcrypt.compare(dto.otp, record.otpHash);
    if (!isMatch) {
      record.attempts += 1;
      if (record.attempts >= MAX_OTP_ATTEMPTS) {
        await PasswordResetModel.deleteOne({ _id: record._id });
        throw new BadRequestException("Maximum attempts exceeded. Please request a new password reset.");
      }
      await record.save();
      throw new BadRequestException("Invalid reset OTP code.");
    }

    return {
      message: "OTP verified successfully. You may now set a new password.",
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const cleanEmail = dto.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(cleanEmail);
    if (!user) {
      throw new BadRequestException("Invalid reset request.");
    }

    const record = await PasswordResetModel.findOne({ userId: user._id, used: false });
    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException("Reset OTP code expired or invalid. Please request a new one.");
    }

    const isMatch = await bcrypt.compare(dto.otp, record.otpHash);
    if (!isMatch) {
      throw new BadRequestException("Invalid reset OTP code.");
    }

    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(dto.newPassword, saltRounds);

    user.password = newHashedPassword;
    user.tokenVersion += 1; // Invalidate all prior sessions
    await user.save();

    await PasswordResetModel.deleteOne({ _id: record._id });

    console.log(`[Password Reset Success] Email: ${user.email}`);

    return {
      message: "Password reset successful. Please log in with your new password.",
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

      if (
        decoded.tokenVersion === undefined ||
        decoded.tokenVersion !== user.tokenVersion
      ) {
        await this.userRepository.incrementTokenVersion(user._id.toString());
        throw new UnauthorizedException(
          "Refresh token reuse detected. Session revoked for security."
        );
      }

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
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async revokeUserSessions(userId: string) {
    await this.userRepository.incrementTokenVersion(userId);
  }
}
