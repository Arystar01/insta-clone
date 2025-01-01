import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPosts } from '../redux/PostSlice.js';

const useGetAllPost = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAllPost = async () => {
            try {
                setLoading(true); // Set loading to true when API call starts
                const res = await axios.get('http://localhost:8000/api/posts/getPosts', { withCredentials: true });
                console.log("API Response:", res.data);

                if (res.data.success) {
                    console.log("Dispatching posts:", res.data.post);
                    dispatch(setPosts(res.data.post));
                } else {
                    console.error("API did not return success:", res.data);
                    setError("Failed to fetch posts.");
                }
            } catch (error) {
                console.error("Error fetching posts:", error.message);
                setError(error.message); // Set error message if API call fails
            } finally {
                setLoading(false); // Set loading to false once the API call completes
            }
        };

        getAllPost();
    }, [dispatch]);

    return { loading, error }; // Return loading and error states for use in components
};

export { useGetAllPost };
