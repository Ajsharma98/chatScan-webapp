import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
const RoomMember = sequelize.define(
  "RoomMember",
  {
    // You can add any extra fields needed for the relationship, such as 'is_admin'
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Timestamp of when the user joined the room
    },
  },
  {
    tableName: "room_member",
  }
);
export default RoomMember;
