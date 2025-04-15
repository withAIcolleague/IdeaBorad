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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('API 요청 시작:', `${API_URL}/api/posts`);
        
        const response = await fetch(`${API_URL}/api/posts`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        console.log('서버 응답:', response.status, response.type);
        
        if (response.type === 'opaque') {
          console.log('opaque 응답 받음 - 서버 연결은 성공');
          // opaque 응답의 경우 임시로 빈 배열 반환
          setPosts([]);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`서버 에러 (${response.status}): ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('받은 데이터:', data);
        setPosts(data);
      } catch (err) {
        console.error('에러 발생:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.');
        // 3번까지 자동 재시도
        if (retryCount < 3) {
          console.log(`${retryCount + 1}번째 재시도 중...`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000); // 2초 후 재시도
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [retryCount]); // retryCount가 변경될 때마다 재시도

  if (loading) {
    return (
      <div className="loading">
        <h2>데이터를 불러오는 중...</h2>
        {retryCount > 0 && <p>{retryCount}번째 재시도 중...</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>에러가 발생했습니다</h2>
        <p>{error}</p>
        {retryCount < 3 && (
          <button onClick={() => setRetryCount(prev => prev + 1)}>
            다시 시도
          </button>
        )}
      </div>
    );
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