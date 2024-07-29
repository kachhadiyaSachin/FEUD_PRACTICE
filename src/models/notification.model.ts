import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFeudsNofification extends Document {
    userId: Types.ObjectId | string;
    rcvId:Types.ObjectId | string;
    message: string
    description :string;
    title:string;
    subject: string,
    role: Number,
    type:string;
    isRead:boolean;
    feudId:Types.ObjectId | string;
    screen:string;
    isAccept:boolean
};

const NotificationSchema = new Schema<IFeudsNofification>({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    rcvId: { type: Schema.Types.ObjectId, ref: "User" }, // receiver user's id
    message: {type: String},
    description: {type: String},
    title: {type: String},
    subject: {type: String},
    role: {type: Number}, //0 is for User, 1 for admin
    type: {type: String},
    isRead :{type:Boolean, default:false},
    feudId :{ type: Schema.Types.ObjectId, ref: "Feuds" },
    // teamId,
    screen: {type: String},
    isAccept:{type:Boolean, default:false},
}, {
    versionKey: false, timestamps:true
});

const Notification = mongoose.model<IFeudsNofification>("Notification", NotificationSchema);
export default Notification;



