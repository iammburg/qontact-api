import express from 'express';
import userController from '../controller/user-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import { verifyCsrfToken } from '../middleware/csrf-middleware.js';
import contactController from '../controller/contact-controller.js';
import addressController from '../controller/address-controller.js';

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API routes
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", verifyCsrfToken, userController.update);
userRouter.delete("/api/users/logout", verifyCsrfToken, userController.logout);

// Contatct API routes
userRouter.post("/api/contacts", verifyCsrfToken, contactController.create);
userRouter.get("/api/contacts/:contactId", contactController.get);
userRouter.put("/api/contacts/:contactId", verifyCsrfToken, contactController.update);
userRouter.delete("/api/contacts/:contactId", verifyCsrfToken, contactController.remove);
userRouter.get("/api/contacts", contactController.search);

// Address API routes
userRouter.post("/api/contacts/:contactId/addresses", verifyCsrfToken, addressController.create);
userRouter.get("/api/contacts/:contactId/addresses/:addressId", addressController.get);
userRouter.put("/api/contacts/:contactId/addresses/:addressId", verifyCsrfToken, addressController.update);
userRouter.delete("/api/contacts/:contactId/addresses/:addressId", verifyCsrfToken, addressController.remove);
userRouter.get("/api/contacts/:contactId/addresses", addressController.list);

export {
    userRouter,
};