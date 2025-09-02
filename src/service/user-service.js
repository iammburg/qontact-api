import { validate } from "../validation/validation.js";
import { loginUserValidation, registerUserValidation, getUserValidation, updateUserValidation } from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username,
        },
    });

    if (countUser === 1) {
        throw new ResponseError(400, "Username already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true,
        }
    });
};

const login = async (req, res) => {
    const loginRequest = validate(loginUserValidation, req.body);

    const user = await prismaClient.user.findUnique({
        where: { username: loginRequest.username }
    });

    if (!user) {
        throw new ResponseError(401, "Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Invalid username or password");
    }

    await new Promise((resolve, reject) => {
        req.session.regenerate(async (err) => {
            if (err)
                return reject(new ResponseError(500, "Session regeneration failed"));

            req.session.user = {
                username: user.username,
                name: user.name,
            };

            req.session.save(async (err2) => {
                if (err2)
                    return reject(new ResponseError(500, "Failed to save session"));
                try {
                    await prismaClient.session.update({
                        where: { id: req.sessionID },
                        data: { user_username: user.username },
                    });

                    resolve();
                } catch (dbErr) {
                    reject(
                        new ResponseError(500, "Failed to update session user mapping")
                    );
                }
            });
        });
    });

    return { message: "Login successful" };
};

const get = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username,
        },
        select: {
            username: true,
            name: true,
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    return user;
};

const update = async (request) => {
    const user = validate(updateUserValidation, request);

    const totalUserInDatabase = await prismaClient.user.count({
        where: {
            username: user.username,
        },
    });

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(404, "User not found");
    }

    const data = {};
    if (user.name) {
        data.name = user.name;
    }
    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }

    return prismaClient.user.update({
        where: {
            username: user.username,
        },
        data: data,
        select: {
            username: true,
            name: true,
        }
    });
};

const logout = async (req, res) => {
    return await new Promise((resolve, reject) => {
        const sid = req.sessionID;

        req.session.destroy(async (err) => {
            if (err) return reject(new ResponseError(500, "Logout failed"));

            res.clearCookie("sid", {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            });

            try {
                await prismaClient.session.delete({
                    where: { id: sid },
                });
            } catch (e) {
                console.error("Failed to delete session from DB", e);
            }

            resolve({ message: "Logout successful" });
        });
    });
};

export default {
    register,
    login,
    get,
    update,
    logout,
};
