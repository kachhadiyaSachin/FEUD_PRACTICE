import mongoose, { Schema, Document, Types } from "mongoose";

const feuduserRequestSchema = new Schema({
    feudId: { type: Schema.Types.ObjectId, ref: "feuds" },
    pollquestion: { type: String},
    options: [{
        option: { type: String },
    }],
    vote1Count: [{type: Number, default:[] }],
    vote2Count: [{type: Number, default:[] }],
    totalVotes: { type: Number, default: 0 },
}, {
    versionKey: false
});

const feudsQA = mongoose.model("FeudsQA", feuduserRequestSchema);
export default feudsQA;



