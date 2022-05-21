import * as mongoose from 'mongoose';
import { Role } from '../role.enum';
export const UserSchema = new mongoose.Schema({
    name: { type: String, nullable: false },
    username: { type: String, nullable: false },
    password: { type: String, nullable: false },
    profilePicture: { type: String, nullable: true, default: null },
    email: { type: String, nullable: false },
    role: { type: String, nullable: false, enum: Role, default: Role.User }
});

UserSchema.methods.toJSON = function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};
