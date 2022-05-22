import * as mongoose from 'mongoose';
export const CommentSchema = new mongoose.Schema(
    {
        post: { type: String, nullable: false },
        commentorUsername: { type: String, nullable: false },
        comment: { type: String, nullable: false }
    },
    { timestamps: true }
);
