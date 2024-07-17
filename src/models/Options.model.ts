import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFeudsOptioncount extends Document {
    feudId: Types.ObjectId | string;
    optionName: string;
    optionId: Types.ObjectId | string;
    optionCount: [ String ];
    voteCount: Number;
};

const UserRequestSchema = new Schema<IFeudsOptioncount>({
    feudId: { type: Schema.Types.ObjectId, ref: "Feuds" },
    optionName: {type: String},
    optionId: { type: Schema.Types.ObjectId, ref: "Feuds" },
    optionCount: [{type: String, default: []}],
    voteCount: {type: Number, default: 0}
}, {
    versionKey: false
});

const Optionscount = mongoose.model<IFeudsOptioncount>("OptionCount", UserRequestSchema);
export default Optionscount;



