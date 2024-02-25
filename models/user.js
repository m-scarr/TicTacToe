export default (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        role: {
            type: DataTypes.ENUM('Administrator', 'User', 'Moderator'),
            defaultValue: 'User'
        },
        username: {
            type: DataTypes.STRING,
            validate: {
                len: [8, 255],
                noSpaces(value) {
                    if (value.includes(' ')) {
                        throw new Error('Username cannot contain spaces.');
                    }
                },
            },
            unique: true,
            allowNull: false
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profilePic: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "./assets/default_profile_pic.png"
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
    });
    User.associate = (models) => {
        User.hasMany(models.Score, { foreignKey: "userId", as: "scores" });
    };
    User.initializeHooks = (models) => {
        User.addHook('afterCreate', (user) => {
            models.Score.create({ userId: user.id, highScore: 0 });
            models.Score.create({ userId: user.id, highScore: 1 });
        })
    }
    return User;
};
