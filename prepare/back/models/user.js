module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  user.associate = (db) => {
    db.user.hasMany(db.post);
    db.user.hasMany(db.comment);
    db.user.belongsToMany(db.post, { through: "like", as: "liked" });
    db.user.belongsToMany(db.user, {
      through: "follow",
      as: "followers",
      foreignKey: "followingId",
    });
    db.user.belongsToMany(db.user, {
      through: "follow",
      as: "followings",
      foreignKey: "followerId",
    });
  };
  return user;
};
