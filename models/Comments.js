module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    CommentBody: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // id, createdAt, updatedAt are automatically added by sequelize
  });

  return Comments;
};
