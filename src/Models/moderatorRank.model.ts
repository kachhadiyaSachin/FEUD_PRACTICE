import mongoose, {Types, Schema } from "mongoose";

export interface ModeratorRank extends Document {
    feudId: Schema.Types.ObjectId,
    ModeratorId: Schema.Types.ObjectId,
    rankData: [Object]
}

export interface UserRank extends Document {
    userId: Schema.Types.ObjectId,
    joinType: Number
    rankAt : Date,
    rank: Number
}

const UserRankschema = new Schema<UserRank>({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    joinType: {type: Number, enum: [1,2,3]}, // 1 for participant, 2 for spactors, 3 for host
    rankAt : Date,
    rank: {type: Number, enum : [1,2,3]} // 1 for bad, 2 for Nuetral, 3 for good
});

const ModeratorRankschema = new Schema<ModeratorRank>({
    feudId: { type: Schema.Types.ObjectId, ref: "Feuds" },
    ModeratorId: { type: Schema.Types.ObjectId, ref: "JoinFeud" },
    rankData: [UserRankschema]
}, {
    versionKey: false
});

const rank = mongoose.model<ModeratorRank>("rank", ModeratorRankschema);
export default rank;