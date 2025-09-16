import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true, 
  },
  lastName: { 
    type: String, 
    required: true, 
  },
  email: { 
    type: String, 
    required: true,  
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: { 
    type: String, 
    required: true,
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: { 
    type: String, 
    enum: {
      values: ["admin", "user"],
      message: 'Role must be either admin or user'
    },
    default: "user" 
  },
  people: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person'
  }]
}, { 
  timestamps: true,
 
});

// Index for faster queries
userSchema.index({ email: 1 });

export const User = mongoose.model("User", userSchema);
