import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import PostTest from "./pages/PostTest";
import FollowTest from "./pages/FollowTest";
import ProfilePage from "./pages/ProfilePage";
import FeedPage from "./pages/FeedPage";
import ChatPage from "./pages/ChatPage";


function App() {
  

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup/>}/>
      <Route
        path="/post-test"
        element={
          <PrivateRoute>
            <PostTest />
          </PrivateRoute>
        }
      />
      <Route path="/follow-test" element={<FollowTest/>}/>
      <Route
        path="/profile/:userId"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/feed"
        element={
          <PrivateRoute>
            <FeedPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
