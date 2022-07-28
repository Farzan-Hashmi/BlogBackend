module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // id, createdAt, updatedAt are automatically added by sequelize
  });

  Posts.associate = (models) => {
    //associates the comments model to the posts model, models is an argument that has access to all the models in our project
    Posts.hasMany(models.Comments, {
      onDelete: "cascade",
    }); //creates PostId column in the Comments table which is a foreign key and points to the id column in the Posts table

    Posts.hasMany(models.Likes, {
      onDelete: "cascade",
    });
  };

  return Posts;
};
