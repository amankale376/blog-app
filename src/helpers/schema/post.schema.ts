import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema(
    {
        title: { type: String, nullable: false },
        content: { type: String, nullable: true },
        user: { type: String, nullable: false }
    },
    { timestamps: true }
);
