import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostList from './components/PostList';
import PostForm from './components/PostForm';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <nav>
          <Link to="/">홈</Link>
          <Link to="/write">글쓰기</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/write" element={<PostForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 