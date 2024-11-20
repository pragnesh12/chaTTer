'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Conversations.init({
    sender_id: DataTypes.STRING,
    receiver_id: DataTypes.STRING,
    latest_messages: DataTypes.STRING,
    showedMessage: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Conversations',
  });
  return Conversations;
};