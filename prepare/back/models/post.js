module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define(
    "post",
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );
  post.associate = (db) => {
    db.post.belongsTo(db.user);
    db.post.hasMany(db.comment);
    db.post.hasMany(db.image);
    db.post.belongsToMany(db.hashtag, { through: "postHashtag" });
    db.post.belongsToMany(db.user, { through: "like", as: "likers" });
    db.post.belongsTo(db.post, { as: "retweet" });
  };
  return post;
};
