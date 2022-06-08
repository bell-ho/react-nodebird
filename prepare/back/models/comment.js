module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define(
    "comment",
    {
      content: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );
  comment.associate = (db) => {
    db.comment.belongsTo(db.user);
    db.comment.belongsTo(db.post);
  };
  return comment;
};
