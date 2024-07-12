import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFeuduserRequest extends Document {
    userId: Types.ObjectId | string;
    status: number;
    requestType: number;
};

const feuduserRequestSchema = new Schema<IFeuduserRequest>({
    userId: { type: Schema.Types.ObjectId, ref: "feuduser" },
    status: { type: Number, default: 0 }, // 0 for pending, 1 for accept, 2 for decline
    requestType: { type: Number, default: 0 } // 1 for "green badge", 2 for "blue badge"
}, {
    versionKey: false
});

const feudUserRequest = mongoose.model<IFeuduserRequest>("UserRequest", feuduserRequestSchema);
export default feudUserRequest;