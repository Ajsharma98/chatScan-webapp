import User from "./User.js";
import Room from "./Room.js";
import Participant from "./Participant.js";
import Message from "./Message.js";
import File from "./File.js";
import RoomMember from "./RoomMember.js";

// One-to-many relationship: A user can create many rooms (owner_id in Room)
User.hasMany(Room, { foreignKey: "owner_id" }); // A user has many rooms, referencing 'owner_id' in Room
Room.belongsTo(User, { foreignKey: "owner_id" }); // A room belongs to a user, referencing 'owner_id' in Room

// Many-to-many relationship: A user can join many rooms, and a room can have many users
User.belongsToMany(Room, { through: RoomMember, foreignKey: "user_id" }); // Users belong to many rooms
Room.belongsToMany(User, { through: RoomMember, foreignKey: "room_id" }); // Rooms have many users

User.hasMany(Message, { foreignKey: "sender_id" }); // A user has many messages, referencing 'user_id' in Message
Message.belongsTo(User, { foreignKey: "sender_id" });

User.belongsToMany(Room, {
  through: Participant,
  foreignKey: "user_id",
  otherKey: "room_id",
}); // Foreign key referencing the 'user_id' in Participant tableotherKey: "room_id", // Other key referencing the 'room_id' in Participant table
Room.belongsToMany(User, {
  through: Participant,
  foreignKey: "room_id",
  otherKey: "user_id",
}); // Foreign key referencing the 'room_id' in Participant table
// Other key referencing the 'user_id' in Participant table

Room.hasMany(Message, { foreignKey: "room_id" }); // A room has many messages, referencing 'room_id' in Message
Message.belongsTo(Room, { foreignKey: "room_id" });

Message.hasMany(File, { foreignKey: "message_id" }); // A message can have many files, referencing 'message_id' in File
File.belongsTo(Message, { foreignKey: "message_id" });
