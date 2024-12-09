import { DataTypes } from "sequelize";
import sequelize from "../Database/db";
const Message = sequelize.define(
  "Message",
  {
    // Email column as primary key

    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Model options

    timestamps: false, // Disable automatic creation of createdAt and updatedAt
    tableName: "messages", // Specify the table name explicitly
  }
);

// Export the model
export default Message;
