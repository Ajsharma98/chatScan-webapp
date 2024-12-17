import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import Room from "./Room.js";
import User from "./User.js";

const Participant = sequelize.define(
  "Participant",
  {
    // Auto-incremented Primary Key
    participant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Room, // Reference the Room model
        key: "room_id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // Reference the User model
        key: "user_id",
      },
    },
    is_admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default: participant is not admin
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Track when the user joined
    },
    is_blocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Default: participant is not blocked
    },
  },
  {
    tableName: "participant", // Explicitly specify the table name
    timestamps: false, // No automatic `createdAt` or `updatedAt`
  }
);
export default Participant;
