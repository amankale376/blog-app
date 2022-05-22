import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema(
    {
        title: { type: String, nullable: false },
        content: { type: String, nullable: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            nullable: false,
            ref: 'User'
        }
    },
    { timestamps: true }
);
