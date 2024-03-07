export default (sequelize, DataTypes) => {
    const Score = sequelize.define("Score", {
        streak: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        highScore: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        }
    });
    Score.associate = (models) => {
        Score.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    };
    Score.initializeHooks = (models) => {
        Score.afterUpdate(async (score) => {
            const highScore = await Score.findOne({ where: { userId: score.dataValues.userId, highScore: 1 } });
            if (score.dataValues.streak > highScore.dataValues.streak) {
                await highScore.update({ streak: score.dataValues.streak });
            }
        })
    }
    return Score;
};
