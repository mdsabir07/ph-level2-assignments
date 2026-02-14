import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    try {
        const result = await CommentService.createComment(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            error: "Comment creation failed!",
            details: error
        })
    }
}

export const CommentController = {
    createComment
}