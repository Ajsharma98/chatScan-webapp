import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import User  from "./User.js";
const Room = sequelize.define(
  "Room",
  {
    // Email column as primary key
    room_name: {
      type: DataTypes.STRING, // Email is stored as a string
      allowNull: false,
      // Email cannot be null
    },
    // Password column
    room_type: {
      type: DataTypes.STRING, // Password is stored as a string (hashed)
      allowNull: false,
      defaultValue: "public", // Password cannot be null
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    room_blocked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    invite_code: {
      type: DataTypes.STRING,
    },
    latest_message: {
      type: DataTypes.STRING,
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Clean",
    },
  },
  {
    // Model options

    timestamps: true, // Disable automatic creation of createdAt and updatedAt
    tableName: "rooms", // Specify the table name explicitly
  }
);

// Export the model
export default Room;
