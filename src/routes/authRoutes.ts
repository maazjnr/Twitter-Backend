import { Router } from "express";
const router = Router();
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;
const JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";
console.log(JWT_SECRET);


function generateEmailToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateAuthToken(tokenId: number): string {
  const jwtPayload = { tokenId };
  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: "HS256",
    noTimestamp: true,
  });
}

//create a user, if it does'nt exist,
//generate email token an send it to the email address
router.post("/login", async (req, res) => {
  const { email } = req.body;

  //generate token
  const emailToken = generateEmailToken();
  const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );

  try {
    const createToken = await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email },
          },
        },
      },
    });
    res.sendStatus(200);

    //send emailToken to user's email address
    console.log(createToken);
  } catch (err) {
    res
      .sendStatus(400)
      .json({ error: "Could not start authentication process" });
  }
});

// validate the emailToken
//Generate a long-lived jwt token
router.post("/authenticate", async (req, res) => {
  const { email, emailToken } = req.body;

  const dbEmailToken = await prisma.token.findUnique({
    where: { emailToken },
    include: { user: true },
  });

  if (!dbEmailToken || !dbEmailToken.valid) {
    return res.sendStatus(401);
  }

  if (dbEmailToken.expiration < new Date()) {
    return res.status(401).json({ error: "Email token expired!" });
  }

  if (dbEmailToken?.user?.email !== email) {
    return res.status(401).json("Wrong token");
  }
  // validating to make user the user is the owner of the email

  //generate an api token
  const expiration = new Date(
    new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
  );
  const apiToken = await prisma.token.create({
    data: {
      type: "API",
      expiration,
      user: {
        connect: {
          email,
        },
      },
    },
  });

  // Invalidate the token
  await prisma.token.update({
    where: { id: dbEmailToken.id },
    data: { valid: false },
  });

  //generate the jwt token
  const authToken = generateAuthToken(apiToken.id);

  res.json({ authToken });
});

export default router;
