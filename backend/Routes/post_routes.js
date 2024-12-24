import express from 'express';

import  isAuthenticated  from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { addNewPost , getAllPost, getUserPost , deletePost, likePost, dislikePost,addComment,getAllComments, bookmark} from '../Controllers/post_controler.js';

const router=express.Router();
router.post('/create',[isAuthenticated, upload.single('image')],addNewPost);
router.get('/getPosts',isAuthenticated,getAllPost);
router.get('/getPost/:id',isAuthenticated,getUserPost);
router.delete('/deletePost/:id',isAuthenticated,deletePost);
router.put('/likepost/:id',isAuthenticated,likePost);
router.put('/dislikepost/:id',isAuthenticated,dislikePost);
router.post('/comment/:id',isAuthenticated,addComment);
router.get('/getComments/all',isAuthenticated,getAllComments);
router.put('/bookmark/:id',isAuthenticated,bookmark);
export default router;


