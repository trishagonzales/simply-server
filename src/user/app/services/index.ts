import cloudinary from 'cloudinary';
import { userRepo } from '../../repos';
import { AuthService } from './AuthService';
import { ImageService } from './ImageService';

export const authService = new AuthService(userRepo);
export const imgService = new ImageService(cloudinary.v2);
