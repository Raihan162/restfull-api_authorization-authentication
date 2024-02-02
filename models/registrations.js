'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class registrations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.students, {
        foreignKey: 'students_id'
      }),
        this.belongsTo(models.courses, {
          foreignKey: 'courses_id'
        })
    };
  };
  registrations.init({
    students_id: DataTypes.INTEGER,
    courses_id: DataTypes.INTEGER,
    registration_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'registrations',
  });
  return registrations;
};