import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema(
    {
        title: { type: String, nullable: false },
        content: { type: String, nullable: true },
        pictures: [{ type: String, nullable: true }], //name of the pictures
        user: {
            type: mongoose.Schema.Types.ObjectId,
            nullable: false,
            ref: 'User'
        }
    },
    { timestamps: true }
);
