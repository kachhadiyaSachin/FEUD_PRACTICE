import mongoose, { Schema, Document, Types } from "mongoose";
import { IFeudsOptioncount } from "../interface/createFeuds.interface";

const feuduserRequestSchema = new Schema<IFeudsOptioncount>({
    feudId: { type: Schema.Types.ObjectId, ref: "feuds" },
    optionId: { type: Schema.Types.ObjectId, ref: "FeudsQA" },
    optionCount: [{type: String, default: []}]
}, {
    versionKey: false
});

const Feudsoptionscount = mongoose.model<IFeudsOptioncount>("OptionCount", feuduserRequestSchema);
export default Feudsoptionscount;



