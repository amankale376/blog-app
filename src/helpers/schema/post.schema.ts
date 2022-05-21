import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema(
    {
        title: { type: String, nullable: false },
        content: { type: String, nullable: true },
        pictures: [{ type: String, nullable: true }] //name of the pictures
    },
    { timestamps: true }
);
