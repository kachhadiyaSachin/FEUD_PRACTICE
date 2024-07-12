import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFeudsOptioncount extends Document {
    feudId: Types.ObjectId | string;
    optionId: Types.ObjectId | string;
    optionCount: [ String ];
};

const feuduserRequestSchema = new Schema<IFeudsOptioncount>({
    feudId: { type: Schema.Types.ObjectId, ref: "Feuds" },
    optionId: { type: Schema.Types.ObjectId, ref: "Feuds" },
    optionCount: [{type: String, default: []}]
}, {
    versionKey: false
});

const Feudsoptionscount = mongoose.model<IFeudsOptioncount>("OptionCount", feuduserRequestSchema);
export default Feudsoptionscount;



