import mongoose, { Schema, Document, Types } from "mongoose";

const feuduserRequestSchema = new Schema({
    feudId: { type: Schema.Types.ObjectId, ref: "feuds" },
    optionId: { type: Schema.Types.ObjectId, ref: "FeudsQA" },
    optionCount: [{type: String, default: []}]
}, {
    versionKey: false
});

const Feudsoptionscount = mongoose.model("FeudsOptionscount", feuduserRequestSchema);
export default Feudsoptionscount;



