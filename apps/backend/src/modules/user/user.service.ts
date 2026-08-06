import { UserRepository } from "./user.repository.js";
import { NotFoundException } from "../../utils/exceptions.js";
import { UpdateUserDto } from "./user.dto.js";

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
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }
}
