import "reflect-metadata";
import Express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createConnection } from "typeorm";
import { UserController } from "./controllers/UserController";
import { MessageController } from "./controllers/MessageController";
import { authCheckMiddleware } from "./middleware/authCheckMiddleware";
const app = Express(); // instance express

app.use(cors());
app.use(bodyParser.json());

// instancier nos controllers
const userController = new UserController();
const messageController = new MessageController();

app.post("/api/users", authCheckMiddleware, userController.create);
app.get("/api/users", authCheckMiddleware, userController.getUsers);
app.get("/api/users/me", authCheckMiddleware, userController.me);
app.get("/api/users/:id", authCheckMiddleware, userController.getUsersById);
app.post("/api/users/login", userController.login);

app.post("/api/message", async (req: Request, res: Response) => {
  const body: any = req.body;
  if (!body || Object.keys(body).length === 0) {
    res.sendStatus(400).end();
  }
  const message = await messageController.createMessage(
    body.texte,
    body.senderId,
    body.receiverId
  );
  res.json(message);
});

createConnection().then(() => {
  app.listen(4000, () => {
    console.log("Server started :4000");
  });
});

