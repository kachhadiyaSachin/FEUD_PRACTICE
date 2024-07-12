import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFeudsNofification extends Document {
    userId: Types.ObjectId | string;
    rcvId:Types.ObjectId | string;
    description :string;
    title:string;
    type:string;
    isRead:boolean;
    feudId:Types.ObjectId | string;
    screen:string;
    isAccept:boolean
};

const feuduserRequestSchema = new Schema<IFeudsNofification>({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    rcvId: { type: Schema.Types.ObjectId, ref: "User" }, // receiver user's id
    description: {type: String},
    title: {type: String},
    type: {type: String},
    isRead :{type:Boolean, default:false},
    feudId :{ type: Schema.Types.ObjectId, ref: "Feuds" },
    // teamId,
    screen: {type: String},
    isAccept:{type:Boolean, default:false},
}, {
    versionKey: false, timestamps:true
});

const feudsNotification = mongoose.model<IFeudsNofification>("Notification", feuduserRequestSchema);
export default feudsNotification;



