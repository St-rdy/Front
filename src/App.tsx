import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Outlet } from 'react-router-dom' // 회원가입, 로그인 때 헤더와 푸터를 숨기기 위해 Outlet을 사용
import Footer from './layouts/footer/Footer'
import Header from './layouts/header/Header'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicOnlyRoute from './routes/PublicOnlyRoute'
import Community from './pages/Community/Community'
import CommunityDetail from './pages/Community/CommunityDetail/CommunityDetail'
import CommunityWrite from './pages/Community/CommunityWrite/CommunityWrite'
import Home from './pages/Home'
import StudyGroupPage from './pages/StudyGroup/StudyGroup'
import StudyGroupDetail from './pages/StudyGroup/StudyGroupDetail/StudyGroupDetail'
import StudyGroupCreate from './pages/StudyGroup/StudyGroupCreate/StudyGroupCreate'
import StudyGroupApply from './pages/StudyGroup/StudyGroupApply/StudyGroupApply'
import StudyGroupCategory from './pages/StudyGroup/StudyGroupCategory/StudyGroupCategory'
import Chat from './pages/Chat/Chat'
import ChatRoom from './pages/Chat/ChatRoom/ChatRoom'
import User from './pages/User/User'
import {
  UserBookmarks,
  UserComments,
  UserPosts,
  UserStudies,
} from './pages/User/UserCollections'
import LoginPage from './pages/auth/LoginPage/LoginPage'
import SignUpPage from './pages/auth/SignUpPage/SignUpPage'
import SignUpCompletePage from './pages/auth/SignUpComplete/SignUpCompletePage'
import OnBoardingPage from './pages/auth/OnBoardingPage/OnBoardingPage'
import StudyManagement from './pages/StudyManagement/StudyManagement'
import StudyManagementCalendar from './pages/StudyManagement/StudyManagementCalendar/StudyManagementCalendar'

// 하단 탭이 있는 5개 메인 화면 + 학습관리에서 쓰는 레이아웃
// Outlet 자리에 자식 컴포넌트가 렌더링됩니다.
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
        {/* 로그인 전에만 볼 수 있는 화면 */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/auth/onboarding" element={<OnBoardingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
        </Route>

        {/* 소셜 로그인 직후 프로필을 등록하는 화면 (토큰은 있고 프로필만 없는 상태) */}
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/auth/signup-complete" element={<SignUpCompletePage />} />

        {/* 로그인이 필요한 화면 */}
        <Route element={<ProtectedRoute />}>
          {/* 헤더 + 하단 탭이 있는 화면 */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/community" element={<Community />} />
            <Route path="/studygroup" element={<StudyGroupPage />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/user" element={<User />} />
            <Route path="/study" element={<StudyManagement />} />
          </Route>

          {/* 자체 헤더를 가진 전체화면 */}
          <Route path="/community/write" element={<CommunityWrite />} />
          <Route path="/community/:id" element={<CommunityDetail />} />
          <Route path="/studygroup/create" element={<StudyGroupCreate />} />
          <Route path="/studygroup/category" element={<StudyGroupCategory />} />
          <Route path="/studygroup/:id" element={<StudyGroupDetail />} />
          <Route path="/studygroup/:id/apply" element={<StudyGroupApply />} />
          <Route path="/study/calendar" element={<StudyManagementCalendar />} />
          <Route path="/chat/:id" element={<ChatRoom />} />
          <Route path="/user/posts" element={<UserPosts />} />
          <Route path="/user/comments" element={<UserComments />} />
          <Route path="/user/bookmarks" element={<UserBookmarks />} />
          <Route path="/user/studies" element={<UserStudies />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
