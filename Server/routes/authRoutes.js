import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';
import { protectRoute } from '../middleware/auth.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protectRoute, (res, req) => {
    res.setEncoding({
        success: true,
        user: req.user,
    })
});

export default router;