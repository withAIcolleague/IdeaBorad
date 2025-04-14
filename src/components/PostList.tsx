import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PostList: React.FC = () => {
  console.log('PostList 컴포넌트 마운트');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log('데이터 가져오기 시작');
      try {
        const response = await fetch(`${API_URL}/api/posts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('서버 응답 상태:', response.status);
        const headers: { [key: string]: string } = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
        console.log('서버 응답 헤더:', headers);
        
        if (!response.ok) {
          throw new Error(`서버 에러: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('받은 데이터:', data);
        setPosts(data);
      } catch (err) {
        console.error('에러 발생:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  console.log('현재 상태:', { loading, error, postsCount: posts.length });

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="error">에러: {error}</div>;
  }

  return (
    <div className="post-list">
      <h1>생각 목록</h1>
      <Link to="/create" className="create-button">새 생각 작성하기</Link>
      {posts.length === 0 ? (
        <div className="no-posts">아직 게시글이 없습니다.</div>
      ) : (
        <div className="posts">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <h2>{post.title}</h2>
              <p>{post.content.substring(0, 100)}...</p>
              <div className="post-meta">
                <span>작성자: {post.author}</span>
                <span>조회수: {post.views}</span>
                <span>좋아요: {post.likes}</span>
                <span>작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <Link to={`/post/${post._id}`} className="read-more">자세히 보기</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList; 