import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const router = Router();

const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { email, username, name } = req.body;

  try {
    const result = await prisma.user.create({
      data: { email, username, name, bio: "hello, i am new on this website" },
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ err: "Username an email address should be unique" });
  }
});

router.get("/", async (req, res) => {
  const allUser = await prisma.user.findMany({
    select: { id: true, name: true, image: true, bio: true },
  });
  res.send(allUser);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { tweets: true },
  });
  res.json(user);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { bio, name, image } = req.body;

  try {
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: { bio, name, image },
    });

    res.json(result);
  } catch (err) {
    res.status(404).json({ err: "Failed to update the user" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: Number(id) } });
  res.status(200);
});

export default router;
