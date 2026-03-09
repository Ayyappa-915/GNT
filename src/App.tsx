import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import CommentsPage from "./features/tables/pages/CommentsPage";
import AlbumsPage from "./features/tables/pages/AlbumsPage";
import UsersPage from "./features/tables/pages/UsersPage";
import PostsPage from "./features/tables/pages/PostsPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="nav">
          <NavLink to="/" end>Comments</NavLink>
          <NavLink to="/albums">Albums</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/posts">Posts</NavLink>
        </nav>

        <div className="page-container">
          <Routes>
            <Route path="/" element={<CommentsPage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/posts" element={<PostsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;