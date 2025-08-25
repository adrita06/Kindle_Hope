const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
const register = async (req, res) => {
  console.log('🚀 Registration request received');
  console.log('📝 Request body:', req.body);
  
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        message: "All fields (name, email, password, role) are required" 
      });
    }

    console.log('🔍 Checking if user exists with email:', email);
    
    // Check if user already exists
    const existing = await db("users").where({ email }).first();
    console.log('👤 Existing user check result:', existing ? 'User exists' : 'User not found');
    
    if (existing) {
      console.log('❌ User already exists');
      return res.status(400).json({ message: "Email already registered" });
    }

    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed successfully');

    console.log('💾 Inserting user into database...');
    
    // Prepare user data
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role
    };
    
    console.log('📊 User data to insert:', { ...userData, password: '[HIDDEN]' });
    
    // Insert user
    const insertResult = await db("users").insert(userData);
    console.log('📝 Insert result:', insertResult);

    console.log('🔍 Fetching inserted user...');
    // Fetch the inserted user
    const newUser = await db("users")
      .select('id', 'name', 'email', 'role')
      .where({ email: email.toLowerCase().trim() })
      .first();
    
    console.log('👤 Fetched user:', newUser);

    if (!newUser) {
      console.log('❌ User not found after insertion - something went wrong');
      return res.status(500).json({ 
        message: "User created but could not be retrieved" 
      });
    }

    console.log('✅ Registration successful for user:', newUser.email);
    res.status(201).json({
      message: "Registration successful!",
      user: newUser
    });

  } catch (err) {
    console.error("❌ Register error:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage,
      stack: err.stack
    });
    
    res.status(500).json({ 
      message: "Registration failed. Please try again.",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await db("users").where({ email }).first();
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role }, // fixed primary key
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
