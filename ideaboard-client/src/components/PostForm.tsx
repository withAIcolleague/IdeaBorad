import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PostForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      console.log('게시글 작성 요청:', formData);
      console.log('API URL:', API_URL);
      
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      }).catch(err => {
        console.error('네트워크 에러:', err);
        throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
      });

      console.log('서버 응답:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `게시글 작성 실패 (${response.status}): ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('작성 완료:', data);
      navigate('/');
    } catch (err) {
      console.error('에러 발생:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-form">
      <h1>새로운 생각 작성하기</h1>
      {error && (
        <div className="error">
          <p style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </p>
          <p style={{ fontSize: '0.9em', color: '#666' }}>
            서버 상태를 확인 중입니다. 잠시만 기다려주세요.
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">작성자</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={10}
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '작성 중...' : '작성하기'}
        </button>
      </form>
    </div>
  );
};

export default PostForm; 