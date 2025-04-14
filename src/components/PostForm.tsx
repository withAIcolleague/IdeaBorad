import React, { useState } from 'react';

const PostForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          author,
        }),
      });

      if (response.ok) {
        alert('게시글이 성공적으로 작성되었습니다.');
        setTitle('');
        setContent('');
        setAuthor('');
      }
    } catch (error) {
      console.error('게시글 작성에 실패했습니다:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div>
        <label>제목:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>작성자:</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <div>
        <label>내용:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit">작성하기</button>
    </form>
  );
};

export default PostForm; 