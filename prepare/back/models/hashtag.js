module.exports = (sequelize, DataTypes) => {
  const hashtag = sequelize.define(
    "hashtag",
    {
      name: { type: DataTypes.STRING(20), allowNull: false },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );
  hashtag.associate = (db) => {
    db.hashtag.belongsToMany(db.post, { through: "postHashtag" });
  };
  return hashtag;
};
