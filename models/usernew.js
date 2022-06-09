'use strict';

const bcrypt = require('bcryptjs');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserNew extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserNew.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    email: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    password: {
      type:  DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5, 10], 
          msg: "Must be between 5 and 10 symbols"}
      }
    },
    passwordConfirm: {
      type:  DataTypes.STRING,
      validate: {
        customValidator(el) {
          if(el !== this.password){
            throw new Error("The passwordd must be equal");
          }
        },
      },
    },
    image: {
      type:  DataTypes.STRING,
      allowNull: true
    },
    pdf: {
      type:  DataTypes.STRING.BINARY,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'UserNew',
  });

  UserNew.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 12);
    //delete the passwordConfirm field
    user.passwordConfirm = undefined;
  });
  UserNew.correctPassword = async function (
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

  return UserNew;
};