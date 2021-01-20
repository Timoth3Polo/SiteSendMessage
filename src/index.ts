import "reflect-metadata"
import Express, { Request, Response } from "express";
import cors from "cors"
import bodyParser from "body-parser"
import {createConnection} from "typeorm"
import {UserController} from "./controllers/UserController"
import { MessageController } from './controllers/MessageController';
const app = Express() // instance express

app.use(cors());
app.use(bodyParser.json());

// instancier nos controllers
const userController = new UserController();
const messageController = new MessageController();

app.post("/api/users", async (req: Request, res: Response) => {
    const body: any = req.body;
    if(!body || Object.keys(body).length === 0) {
        res.sendStatus(400).end()
    }
    const user = await userController.create(body.nom, body.prenom, body.mail, body.mdp, body.telephone, body.pseudo, new Date())
    res.json(user)
});

app.get("/api/users", async (req: Request, res: Response) => {
    const users = await userController.getUsers();
    res.json(users)
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
    const user = await userController.getUsersById(req.params.id);
    if(!user) {
        res.sendStatus(404)
        return;
    }
    res.json(user)
});


app.post("/api/message", async (req: Request, res: Response) => {
    const body: any = req.body;
    if(!body || Object.keys(body).length === 0) {
        res.sendStatus(400).end()
    }
    const message = await messageController.createMessage(body.texte, body.senderId, body.receiverId)
    res.json(message)
});

createConnection().then(() => {
    // userController.create("Paul", "Timothe", "tim@tim.com", "tim123", "0694589000", "tim", new Date())
    //     .then(data => console.log(data))
    app.listen(4000, ()=> {
        console.log("Server started :4000");
    });
});

//const maFonction = () => {} === function maFunction() {}
/*
Déclaration d'une route (url)
app.get("/ping", (req: Request, res: Response) => {
    res.send("pong")
});
*/
// const startServer = async () => {
//     await createConnection();
//     app.listen(4000, ()=> {
//         console.log("Server started :4000");
//     });
// }

