import mongoose, { Schema, Document, Types } from "mongoose";
import { IFeudsNofification } from "../interface/createFeuds.interface";

const feuduserRequestSchema = new Schema<IFeudsNofification>({
    userId: { type: Schema.Types.ObjectId, ref: "feuduser" },
    profilePic: {type: String},
    badge: {type: Number},
    message: {type: String},
    title: {type: String},
}, {
    versionKey: false
});

const feudsNotification = mongoose.model<IFeudsNofification>("Notification", feuduserRequestSchema);
export default feudsNotification;



