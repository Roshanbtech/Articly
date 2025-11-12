import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        status: "OK",
        message: "I'm perfectly alright, man! Can't wait to see you performing actions 🚀",
        timestamp: new Date().toISOString()

    })
})

export default router;