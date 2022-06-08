module.exports = (sequelize, DataTypes) => {
  const image = sequelize.define(
    "image",
    {
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  image.associate = (db) => {
    db.image.belongsTo(db.post);
  };
  return image;
};
