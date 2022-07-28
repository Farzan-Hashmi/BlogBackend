module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // id, createdAt, updatedAt are automatically added by sequelize
  });

  Users.associate = (models) => {
    //associates the posts  model to the users  model, models is an argument that has access to all the models in our project. one user has many posts (one to many relationship)
    Users.hasMany(models.Posts, {
      onDelete: "cascade",
    }); //creates a userid column in the Posts table which is a foreign key and points to the id column in the Users table

    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });

    Users.hasMany(models.Comments, {
      onDelete: "cascade",
    });
  };
  return Users;
};
