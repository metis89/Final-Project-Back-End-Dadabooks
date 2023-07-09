import * as dotenv from 'dotenv';
dotenv.config();

export const user = process.env.DB_USER;
export const passwd = process.env.DB_PASSWORD;
export const db = process.env.DB_NAME;
export const secret = process.env.JWT_SECRET;

// Export const firebaseConfig = {
//   apiKey: 'AIzaSyBie8fPv9rDTPZMj4i2Px8WfzqMOX3hV9o',
//   authDomain: 'sofia-final-project.firebaseapp.com',
//   projectId: 'sofia-final-project',
//   storageBucket: 'sofia-final-project.appspot.com',
//   messagingSenderId: '1086080543858',
//   appId: '1:1086080543858:web:d1432f83c69360afdda6eb',
// };
