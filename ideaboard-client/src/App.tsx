import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import './App.css';

const App: React.FC = () => {
  console.log('App 컴포넌트 렌더링');
  
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>생각짜내기</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/create" element={<PostForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
