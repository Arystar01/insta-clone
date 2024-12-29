
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPosts } from '../redux/PostSlice.js';
const useGetAllPost= ()=>{
    const dispatch= useDispatch();
    useEffect(()=>{
        const getAllPost=async()=>{
            try {
                const res =await axios.get('http://localhost:3000/api/posts/getPosts',{withCredentials:true});
                if(res.data.success){
                    console.log(res.data.posts);
                    dispatch(setPosts(res.data.posts));
                }
                console.log(res.data);
                
            } catch (error) {
                console.log(error);
            }
           
        }
        getAllPost();
    },[])
}
export {useGetAllPost};