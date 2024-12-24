import express from 'express';
import { createMessage, getMessages } from '../Controllers/Message_controller.js';
import  isAuthenticated  from '../middlewares/isAuthenticated.js';

const router=express.Router();
router.post('/create/:id',isAuthenticated,createMessage);
router.get('/getMessages/:id',isAuthenticated,getMessages);
export default router;

 