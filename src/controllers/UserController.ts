import { User } from '../models/User';
export class UserController {

    async create(nom: string, prenom: string, mail: string, mdp: string, telephone: string, pseudo: string, dateDeNaissance: Date): Promise<User> {
        const newUser = User.create({
            nom,
            prenom,
            mail,
            mdp,
            telephone,
            pseudo,
            dateDeNaissance
        });
        return await newUser.save();
    }
    async getUsers(): Promise<Array<User>> {
        return await User.find({relations: ["sendMessages", "receiveMessage"]});
    }

    async getUsersById(id: string) {
        return await User.findOne(id, {relations: ["sendMessages", "receiveMessage"]})
    }
}