import * as express from "express";
import { UserService } from "../services/userdb";

const setExpiry = () => {
    const HOUR = 60 * 60 * 3600;
    return new Date(Date.now() + HOUR);
};
const isAuthenticated = (req: express.Request) => "userid" in req.cookies && req.cookies["userid"].length === 36;

const isAuthorised = async (req: express.Request) => {
    if ("userid" in req.cookies && "username" in req.cookies) {
        const service = req.app.locals.userService as UserService;
        const id = req.cookies["userid"];
        const username = Buffer.from(req.cookies["username"]).toString("utf8");
        return await service.authorize(id, username);
    }
    return false;
};

const userRouter = express.Router();
userRouter.use(express.urlencoded({ extended: true }));
userRouter.post("/user/login", async (req, res) => {
    if (!isAuthenticated(req)) {
        const service = req.app.locals.userService as UserService;
        const { username, password } = req.body;
        const result = await service.authenticate(username, password);

        res.clearCookie("userid");

        if (result !== null) {
            const expires = setExpiry();
            res.cookie("userid", result.id, { expires });
            res.cookie("username", Buffer.from(result.first_name).toString("base64"), { expires });
            res.json({
                name: result.first_name,
            });
        } else {
            res.status(401).json({ message: "Unknown username or password" });
        }
    } else {
        const expires = setExpiry();
        res.cookie("userid", req.cookies["userid"], { expires });
        res.cookie("username", req.cookies["username"], { expires });
        res.status(204).json();
    }
});

userRouter.get("/user/logout", (_, res) => {
    res.clearCookie("userid");
    res.clearCookie("username");
    res.json({ message: "logged out" });
});

export { userRouter, isAuthorised };
