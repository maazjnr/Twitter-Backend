import { Router } from "express";
const router = Router();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//Creating tweet

router.post("/", async (req, res) => {
  const { content, userId, image } = req.body;

  try {
    const result = await prisma.tweet.create({
      data: { userId, image, content },
    });
    res.json(result);
  } catch (err) {
    res.status(404).send({ err: err });
  }
});

//List tweet
router.get("/", async (req, res) => {
  const allTweets = await prisma.tweet.findMany({
    include: {
      user: { select: { id: true, name: true, username: true, image: true } },
    },
  });
  res.json(allTweets);
});

//get one tweets
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const tweet = await prisma.tweet.findUnique({ where: { id: Number(id) } });
  if (!tweet) {
    return res.status(404).json({ error: "No tweet found" });
  }
  res.json(tweet);
});

//Update tweets
router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `User not implemented ${id}` });
});

//Delete tweets
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.tweet.delete({ where: { id: Number(id) } });
  res.sendStatus(200);
});

export default router;
