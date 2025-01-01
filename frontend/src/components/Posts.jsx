import React from 'react';
import { useSelector } from 'react-redux';
import { useGetAllPost } from '../hooks/useGetAllPost.js';
import Post from './Post.jsx';

const Posts = () => {
  const { posts } = useSelector(state => state.post);
  const { loading, error } = useGetAllPost();

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error loading posts: {error}</div>;
  }

  return (
    <div>
      {posts && posts.length > 0 ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <div>No posts available.</div>
      )}
    </div>
  );
};

export default Posts;
