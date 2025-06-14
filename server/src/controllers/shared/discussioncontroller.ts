import { Response } from "express";
import { JwtRequest } from "../../types";
import prisma from "../../utils/prismaClient";

// get discussions for a course
export const getDiscussionsByCourseId = async (
  req: JwtRequest,
  res: Response
) => {
  const courseId = parseInt(req.params.courseId);

  try {
    const discussions = await prisma.discussionPost.findMany({
      where: {
        courseId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (discussions.length === 0) {
      res.status(404).json({ message: "No posts found" });
      return;
    }

    res.status(200).json({ discussions });
  } catch (error) {
    console.error("Error getting discussion posts: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// create a discussion post
export const createDiscussionPost = async (req: JwtRequest, res: Response) => {
  const courseId = parseInt(req.params.courseId);
  const userId = req.user?.userId;
  const { content } = req.body;

  try {
    const createdPost = await prisma.discussionPost.create({
      data: {
        userId: Number(userId),
        courseId,
        content,
      },
    });

    res
      .status(201)
      .json({ message: "Successfully created post.", createdPost });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Error creating discussion post" });
  }
};

// get a course discussion post by id
export const getDiscussionPostById = async (req: JwtRequest, res: Response) => {
  const courseId = parseInt(req.params.courseId);
  const postId = parseInt(req.params.postId);

  try {
    const post = await prisma.discussionPost.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(200).json({ message: "Post found", post });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Error getting post" });
  }
};

// Update discussion post by id
export const updateDiscussionPostById = async (
  req: JwtRequest,
  res: Response
) => {
  const courseId = parseInt(req.params.courseId);
  const postId = parseInt(req.params.postId);
  const userId = req.user?.userId;
  const { content } = req.body;

  if (!userId) {
    res.status(400).json({ message: "Unauthorized" });
    return;
  }

  try {
    const post = await prisma.discussionPost.findFirst({
      where: { id: postId, userId, courseId },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    if (post?.userId !== userId) {
      res.status(403).json({ message: "Unauthorized to modify this post" });
      return;
    }

    const updatedPost = await prisma.discussionPost.update({
      where: {
        id: postId,
      },
      data: {
        content,
        updatedAt: new Date(),
      },
    });

    res.json({ message: "post updated", updatedPost });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete course discussion post by id
export const deleteDiscussionPostById = async (
  req: JwtRequest,
  res: Response
) => {
  const courseId = parseInt(req.params.courseId);
  const postId = parseInt(req.params.postId);
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ message: "Unauthorized" });
    return;
  }

  try {
    const post = await prisma.discussionPost.findFirst({
      where: { id: postId, userId, courseId },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    if (post?.userId !== userId) {
      res.status(403).json({ message: "Unauthorized to modify this post" });
      return;
    }

    await prisma.discussionPost.delete({
      where: {
        id: postId,
      },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Replies

// create post reply
export const createDiscussionPostReply = async (
  req: JwtRequest,
  res: Response
) => {
  const postId = parseInt(req.params.postId);
  const userId = req.user?.userId;
  const { content } = req.body;

  if (!userId) {
    res.status(400).json({ message: "Unauthorized" });
    return;
  }

  try {
    const postReply = await prisma.discussionReply.create({
      data: {
        postId,
        userId,
        content,
      },
    });

    res.status(200).json({ message: "Reply sent successfully", postReply });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get a reply by id
export const getPostReplyById = async (req: JwtRequest, res: Response) => {
  const replyId = parseInt(req.params.replyId);
  const postId = parseInt(req.params.postId);
  const userId = req.user?.userId;

  try {
    const reply = await prisma.discussionReply.findUnique({
      where: {
        id: replyId,
        postId,
        userId,
      },
    });

    if (!reply) {
      res.status(404).json({ message: "reply not found" });
      return;
    }

    res.status(200).json({ message: "Reply found", reply });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateReplyPostById = async (req: JwtRequest, res: Response) => {
  const replyId = parseInt(req.params.replyId);
  const postId = parseInt(req.params.postId);
  const userId = req.user?.userId;

  const { content } = req.body;

  if (!userId) {
    res.status(400).json({ message: "Unauthorized" });
    return;
  }

  try {
    const reply = await prisma.discussionReply.findFirst({
      where: { id: postId, postId, userId },
    });

    if (!reply) {
      res.status(404).json({ message: "Reply not found" });
      return;
    }
    if (reply?.userId !== userId) {
      res.status(403).json({ message: "Unauthorized to modify this reply" });
      return;
    }

    const updatedReply = await prisma.discussionReply.update({
      where: {
        id: replyId,
      },
      data: {
        content,
        updatedAt: new Date(),
      },
    });

    res
      .status(200)
      .json({ message: "reply updated successfully", updatedReply });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReplyPostById = async (req: JwtRequest, res: Response) => {
  const replyId = parseInt(req.params.replyId);
  const postId = parseInt(req.params.postId);
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ message: "Unauthorized" });
    return;
  }

  try {
    const reply = await prisma.discussionReply.findFirst({
      where: { id: postId, postId, userId },
    });

    if (!reply) {
      res.status(404).json({ message: "Reply not found" });
      return;
    }
    if (reply?.userId !== userId) {
      res.status(403).json({ message: "Unauthorized to modify this reply" });
      return;
    }

    await prisma.discussionReply.delete({
      where: {
        id: replyId,
      },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
