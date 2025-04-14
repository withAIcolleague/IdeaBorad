import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Post {
  _id: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('게시글을 불러오는데 실패했습니다:', error);
    }
  };

  return (
    <div className="post-list">
      <h1>생각짜내기</h1>
      <div className="post-header">
        <span>번호</span>
        <span>제목</span>
        <span>작성자</span>
        <span>작성일</span>
        <span>조회수</span>
        <span>추천</span>
      </div>
      {posts.map((post, index) => (
        <div key={post._id} className="post-item">
          <span>{index + 1}</span>
          <Link to={`/post/${post._id}`}>{post.title}</Link>
          <span>{post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span>{post.views}</span>
          <span>{post.likes}</span>
        </div>
      ))}
    </div>
  );
};

export default PostList; 