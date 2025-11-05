import { Routes, Route, useLocation } from 'react-router-dom';
import Post from './Post.jsx';
import Home from './Home.jsx';

export default function App({ initialData }) {
  return (
    <div style={{ fontFamily: 'system-ui', padding: 20 }}>
      <h1>🚀 React SSR Works!</h1>
      <Routes>
        <Route path="/" element={<Home data={initialData} />} />
        <Route path="/post/:id" element={<Post data={initialData} />} />
      </Routes>
    </div>
  );
}