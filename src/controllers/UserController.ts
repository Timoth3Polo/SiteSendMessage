import { validate } from "class-validator";
import e, { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { hash, compare } from "bcrypt";
import "dotenv/config";
import { sign } from "jsonwebtoken";
import { getRepository } from "typeorm";
import { Enterprise } from '../models/Enterprise';
export class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    const body: User = req.body;
    const enterprise1 = await Enterprise.create({name:`enterprise1`}).save();
    const enterprise2 = await Enterprise.create({name:`enterprise2`}).save();
    const newUser = User.create({
      ...body,
      enterprise: [ enterprise1, enterprise2]
    });
    const errors = await validate(newUser);

    if (errors.length > 0) {
      res.status(400).send({ messages: errors });
    } else {
      const hashedPassword = await hash(newUser.mdp, 12);
      newUser.mdp = hashedPassword;
      res.json(await newUser.save());
    }
  }
  async getUsers(req: Request, res: Response, next: NextFunction) {
    const users = await User.find({
      relations: ["sendMessages", "receiveMessage", "enterprise"],
    });
    res.json(users);
  }

  async getUsersById(req: Request, res: Response, next: NextFunction) {
    const user = await User.findOne(req.params.id, {
      relations: ["sendMessages", "receiveMessage", "enterprise"],
    });
    if (!user) {
      res.sendStatus(404);
      return;
    }
    res.json(user);
  }
  async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body; // {username, password}
    if (!username || !password) {
      res.status(400).send({ messages: "invalide" });
      return;
    }

    const user = await User.findOne({ where: { pseudo: username } });

    if (!user) {
      res.status(404).send({ messages: "Utilisateur innexistant" });
      return;
    }

    const passwordVerify = await compare(password, user.mdp);

    if (!passwordVerify) {
      res.status(401).send({ messages: "Les identifiants sont incorrect" });
      return;
    }
    const jwt = sign(
      { id: user.id, pseudo: user.pseudo },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    res.json({ token: jwt });
  }

  async me(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(400).send({ message: "Userid introuvable" });
    }
    const me = await User.findOne(userId, {
      relations: ["sendMessages", "receiveMessage"],
    });

    if (!me) {
      return res.status(404).send({ message: "Utilisateur introuvable" });
    }

    return res.json(me);
  }

  async patchUser(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).userId;
    const body: User = req.body;
    if (!userId) {
      return res.status(404).send({ message: "Userid introuvable" });
    }
    const me = await User.findOne(userId);
    if (!me) {
      return res.status(404).send({ message: "Utilisateur introuvable" });
    }
    const userRepository = getRepository(User);
    await userRepository.update(me?.id, body)
      .catch(() => res.sendStatus(500))
      
    return res.json(await userRepository.findOne(me.id));
  }
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const userIdToDelete = req.params.id;

    const userToDelete = await User.findOne(userIdToDelete);

    if(!userToDelete) {
      return res.status(404).send({ message: "Userid introuvable" });
    }
    const userRepository = getRepository(User);
    userRepository.delete(userToDelete.id)
    return res.json({message: `L'utilisateur avec l'id ${userIdToDelete} est delete`})
  }
}
