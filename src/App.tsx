import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Outlet } from 'react-router-dom' // 회원가입, 로그인 때 헤더와 푸터를 숨기기 위해 Outlet을 사용
import Footer from './layouts/Footer/Footer'
import Header from './layouts/header/Header'
import Community from './pages/Community/Community'
import CommunityDetail from './pages/Community/CommunityDetail/CommunityDetail'
import CommunityWrite from './pages/Community/CommunityWrite/CommunityWrite'
import Home from './pages/Home'
import StudyGroupPage from './pages/StudyGroup/StudyGroup'
import StudyGroupDetail from './pages/StudyGroup/StudyGroupDetail/StudyGroupDetail'
import StudyGroupCreate from './pages/StudyGroup/StudyGroupCreate/StudyGroupCreate'
import StudyGroupApply from './pages/StudyGroup/StudyGroupApply/StudyGroupApply'
import Chat from './pages/Chat'
import User from './pages/User'
import LoginPage from './pages/auth/LoginPage/LoginPage'
import SignUpPage from './pages/auth/SignUpPage/SignUpPage'
import SignUpCompletePage from './pages/auth/SignUpComplete/SignUpCompletePage'
import OnBoardingPage from './pages/auth/OnBoardingPage/OnBoardingPage'

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
          <Route path="/studygroup" element={<StudyGroupPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/user" element={<User />} />
        </Route>

        <Route path="/community/:id" element={<CommunityDetail />} />
        <Route path="/community/write" element={<CommunityWrite />} />
        <Route path="/studygroup/:id" element={<StudyGroupDetail />} />
        <Route path="/studygroup/create" element={<StudyGroupCreate />} />
        <Route path="/studygroup/:id/apply" element={<StudyGroupApply />} />
        <Route path="/auth/onboarding" element={<OnBoardingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/auth/signup-complete" element={<SignUpCompletePage />} />
      </Routes>
    </Router>
  )
}

export default App
