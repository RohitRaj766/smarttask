import bcrypt from "bcryptjs";
import { UserRepository } from "./user.repository.js";
import { NotFoundException, BadRequestException } from "../../utils/exceptions.js";
import { UpdateUserDto, ChangePasswordDto } from "./user.dto.js";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(userId: string) {
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

  async updateUser(userId: string, dto: UpdateUserDto) {
    const updated = await this.userRepository.updateById(userId, dto);
    if (!updated) {
      throw new NotFoundException("User not found");
    }
    return {
      _id: updated._id.toString(),
      name: updated.name,
      email: updated.email,
      isEmailVerified: updated.isEmailVerified,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!dto.oldPassword) {
      throw new BadRequestException("Current password is required");
    }

    if (!user.password) {
      throw new BadRequestException("User password record not found");
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException("Current password is incorrect");
    }

    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(dto.newPassword, saltRounds);

    user.password = newHashedPassword;
    user.tokenVersion += 1;
    await user.save();

    return { message: "Password updated successfully" };
  }
}
