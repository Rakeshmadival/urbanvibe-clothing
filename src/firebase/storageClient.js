import { getStorage } from 'firebase/storage';
import app from './app.js';

export const storage = getStorage(app);
// Firebase Storage removed.
// Images are uploaded directly to Cloudinary.
export const storage = null;