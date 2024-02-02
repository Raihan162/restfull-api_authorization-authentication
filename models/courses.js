'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class courses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.registrations, {
        foreignKey: 'courses_id'
      }),
        this.belongsTo(models.lecturers, {
          foreignKey: 'lecturers_id'
        })
    }
  }
  courses.init({
    title: DataTypes.STRING,
    lecturers_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'courses',
  });
  return courses;
};