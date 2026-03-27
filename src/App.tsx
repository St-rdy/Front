import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Outlet } from 'react-router-dom' // 회원가입, 로그인 때 헤더와 푸터를 숨기기 위해 Outlet을 사용
import Footer from './layouts/Footer/Footer'
import Header from './layouts/header/Header'
import Community from './pages/Community'
import Home from './pages/Home'
import StudyGroup from './pages/StudyGroup'
import Chat from './pages/Chat'
import User from './pages/User'
import SignUpPage from './pages/auth/SignUpPage'
import SignUpCompletePage from './pages/auth/SignUpCompletePage'

// 회원가입, 로그인을 제외한 나머지 모든 페이지에선 헤더와 푸터가 보이게 MainLayout 컴포넌트를 만들어 라우팅을 지정
// Outlet이란 Outlet 자리에 자식의 컴포넌트가 랜더링 되는 것을 의미한다.
function MainLayout() {
  return (
    <>
      <Header />
      <main>
        {/* 자식 컴포넌트 자리 (community, studygroup, home 등...) */}
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/community" element={<Community />} />
          <Route path="/studygroup" element={<StudyGroup />} />
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/user" element={<User />} />
        </Route>

        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/auth/signup-complete" element={<SignUpCompletePage />} />
      </Routes>
    </Router>
  )
}

export default App
