import User from "../Model/User.js";
import bcrypt from "bcryptjs";
import PasswordValidator from "password-validator";
import jwt from "jsonwebtoken";

export const signupUsers = async (req, res) => {
  try {
    var schema = new PasswordValidator();

    schema
      .is()
      .min(8) // Minimum length 8
      .is()
      .max(100) // Maximum length 100
      .has()
      .uppercase() // Must have uppercase letters
      .has()
      .lowercase() // Must have lowercase letters
      .has()
      .digits(2) // Must have at least 2 digits
      .has()
      .not()
      .spaces() // Should not have spaces
      .is()
      .not()
      .oneOf(["Passw0rd", "Password123"]); // Blacklist these values
  
    const { email, password, confirmPassword, display_name } = req.body; // accepting the input value from user
    console.log(req.body);

   
    if (!email || !password || !confirmPassword || !display_name) { // checking for empty value from user
      return res.status(400).json({
        message: "Email, password, name and confirm password are required",
      });
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;          // using email regular expression for checking email format 
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
 
    if (email !== email.toLowerCase()) {                    // converting email to lowercase 
      return res.status(400).json({ message: "Email should be in lowercase" });
    }
  
    if (password !== confirmPassword) {                        // Check if password and confirmPassword match
      return res.status(400).json({ message: "Passwords do not match" });
    }
    
    console.log(schema.validate(password), "error from schema");  // validating the password from schema 
    const passwordValid = schema.validate(password);
    if (!passwordValid) {
      return res
        .status(400)
        .json({ message: "Password is not strong enough!" });
    }
   
    const existingUser = await User.findOne({ where: { email } });  // Check if the user already exists
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);   // Hash the password and create a new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      display_name,
    });

    return res
      .status(201)
      .json({ message: "SignUp successful", user_id: newUser.user_id });
  } catch (error) {
    console.error("Error during signup:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const loginUsers = async (req, res) => {
  try {
    let { email, password } = req.body;//accepting the email and password in request body 
    email = email.toLowerCase(); // converting email to lower case
   

    const user = await User.findOne({ where: { email } }); // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.user_blocked === 1) {// checking if the user is blocked or not if yes then not authorized to enter them to home page
      return res
        .status(403)
        .json({ message: "Account is deactivated. Please contact admin." });
    }

   
    const passwordMatch = await bcrypt.compare(password, user.password); // Compare password
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email }, // providing the id and email in jwt token for authorization 
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logoutUsers = (req, res) => {
  return res.status(200).json({ message: "Logout successful" });
};
