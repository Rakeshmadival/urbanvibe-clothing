import { getAuth } from 'firebase/auth';
import app from './app.js';

export const auth = getAuth(app);
