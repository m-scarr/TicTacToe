import db from "../models/index.js"

export default {
    authorized: {
        readHighScores: async (req, res) => {
            const highScores = await db.Score.findAll({ where: { highScore: 1 }, order: [['streak', 'DESC']], limit: 20, include: [{ model: db.User, as: "user" }] });
            res.json(highScores);
        },
    },
    incrementStreak: async (userId) => {
        const score = await db.Score.findOne({ where: { userId, highScore: 0 } });
        await score.update({ streak: score.dataValues.streak + 1 });
    },
    endStreak: async (userId) => {
        await db.Score.update({ streak: 0 }, { where: { userId, highScore: 0 } });
    }
}
