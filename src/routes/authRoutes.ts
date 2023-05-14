import { Router } from "express";
const router = Router();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;

function generateEmailToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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

  if(dbEmailToken.expiration < new Date()) {
    return res.status(401).json({ error: "Email token expired!"});
  }

  if(dbEmailToken?.user?.email !== email)  {
    return res.status(401).json("Wrong token")
  }
  // validating to make user the user is the owner of the email

  //generate an api token

  res.sendStatus(200);
});

export default router;
