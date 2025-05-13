import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createManager = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const managerData = {
      name: 'System Manager',
      email: 'manager@kgl.com',
      password: 'Manager123!',
      role: 'manager',
      branch: 'Maganjo'
    };

    const manager = new User(managerData);
    await manager.save();
    
    console.log('Manager account created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating manager:', error);
    process.exit(1);
  }
};

createManager();