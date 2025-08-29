import { validate } from "../validation/validation.js";
import { loginUserValidation, registerUserValidation, getUserValidation, updateUserValidation } from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v7 as uuid } from "uuid";

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

    req.session.user = {
        username: user.username,
        name: user.name
    };

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
    req.session.destroy((err) => {
        if (err) {
            throw new ResponseError(500, "Logout failed");
        }
    });
    return { message: "Logout successful" };
};

export default {
    register,
    login,
    get,
    update,
    logout,
};