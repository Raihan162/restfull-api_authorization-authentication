'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class students extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.registrations, {
        foreignKey: 'students_id'
      })
    }
  }
  students.init({
    name: DataTypes.STRING,
    major: DataTypes.STRING,
    contact: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'students',
  });
  return students;
};