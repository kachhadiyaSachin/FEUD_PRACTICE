import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserRequest extends Document {
    userId: Types.ObjectId | string;
    status: number;
    requestType: number;
};

const UserRequestSchema = new Schema<IUserRequest>({
    userId: { type: Schema.Types.ObjectId, ref: "feuduser" },
    status: { type: Number, default: 0 }, // 0 for pending, 1 for accept, 2 for decline
    requestType: { type: Number, default: 0 } // 1 for "green badge", 2 for "blue badge"
}, {
    versionKey: false
});

const UserRequest = mongoose.model<IUserRequest>("UserRequest", UserRequestSchema);
export default UserRequest;