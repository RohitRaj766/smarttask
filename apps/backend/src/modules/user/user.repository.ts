import { BaseRepository } from "../../shared/base.repository.js";
import { UserModel } from "./user.schema.js";
import { IUserDocument } from "./user.types.js";

export class UserRepository extends BaseRepository<IUserDocument> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return this.model
      .findOne({ email: email.toLowerCase(), isDeleted: false })
      .select("+password")
      .exec();
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return this.model.findOne({ _id: id, isDeleted: false }).exec();
  }

  async incrementTokenVersion(userId: string): Promise<IUserDocument | null> {
    return this.model
      .findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { $inc: { tokenVersion: 1 } },
        { new: true }
      )
      .exec();
  }
}
