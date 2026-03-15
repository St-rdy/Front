import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './layouts/Footer/Footer'
import Header from './layouts/header/Header'
import Community from './pages/Community'
import Home from './pages/Home'
import StudyGroup from './pages/StudyGroup'
import Chat from './pages/Chat'
import User from './pages/User'

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/community" element={<Community />} />
          <Route path="/studygroup" element={<StudyGroup />} />
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App
