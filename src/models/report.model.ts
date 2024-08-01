import mongoose, {Schema, Document, Types} from "mongoose";

export interface IFeudsReport extends Document {
    userId: Types.ObjectId | string;
    ReportedUserId:Types.ObjectId | string;
    reason: string
    otherReason :string;
    feudId:Types.ObjectId | string;
    isModerator:boolean;
};

const ReportSchema = new Schema<IFeudsReport>({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    ReportedUserId: { type: Schema.Types.ObjectId, ref: "User" },
    reason: {type: String},
    otherReason: {type: String},
    feudId: { type: Schema.Types.ObjectId, ref: "Feuds" },
    isModerator: {type: Boolean, default: false}
}, {
    timestamps: true,
    versionKey: false
});

const Report = mongoose.model<IFeudsReport>("Report", ReportSchema);
export default Report;
