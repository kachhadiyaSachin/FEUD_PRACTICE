import mongoose, { Schema, Document, Types } from "mongoose";

const feuduserRequestSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "feuduser" },
    profilePic: {type: String},
    badge: {type: String},
    message: {type: String},
    title: {type: String},
}, {
    versionKey: false
});

const feudsNotification = mongoose.model("CreateFeudnotification", feuduserRequestSchema);
export default feudsNotification;



