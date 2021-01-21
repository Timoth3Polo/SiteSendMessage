import { NextFunction, Request, Response } from "express";
import "dotenv/config"
import { verify } from "jsonwebtoken"
export const authCheckMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if(!authHeader) {
        return res.sendStatus(401)
    }
    const [_, token] =  authHeader.split(" ")

    try {
        const userInfo: any = verify(token, (process.env.JWT_SECRET as string))
        Object.assign(req, {userId: userInfo.id }) // ===   req.userId = adzazdad
    } catch (error) {
        return res.sendStatus(401)
    }
    return next()
}