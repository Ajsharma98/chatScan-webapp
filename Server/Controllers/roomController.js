import Room from "../Model/Room.js";


export const getAllRooms = async (req, res) => {
  try {
    
    const rooms = await Room.findAll();// Fetch all rooms from the database

   
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" }); // Handle empty result set
    }

  
    return res.status(200).json({
      message: "Rooms fetched successfully",
      rooms, // Return the rooms data as JSON
    });
  } catch (error) {
  
    console.error("Error fetching rooms:", error);

 
    return res.status(500).json({ message: "Internal server error" });
  }
};
