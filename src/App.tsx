import { useState } from 'react'
import { Input } from './components/Input'
import { Modal } from './components/Modal'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './layouts/Footer/Footer'
import Header from './layouts/header/Header'
import Community from './pages/Community'
import Home from './pages/Home'
import StudyGroup from './pages/StudyGroup'
import Chat from './pages/Chat'
import User from './pages/User'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const [isModalOpen3, setIsModalOpen3] = useState(false)

  return (
    <Router>
      <Header />
      <button onClick={() => setIsModalOpen(true)}>모달 열기</button>
      <button onClick={() => setIsModalOpen2(true)}>단일 버튼 모달 열기</button>
      <button onClick={() => setIsModalOpen3(true)}>하단 모달 열기</button>
      <Input
        label="아이디"
        placeholder="아이디를 입력해주세요"
        type="text"
        multiline={false}
      />
      <Input
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요"
        type="password"
        multiline={false}
      />
      <Input
        label="별명"
        placeholder="별명을 입력해주세요"
        type="text"
        rightAction={{
          label: '중복 확인',
          onClick: () => {
            alert('중복 확인 버튼 클릭됨')
          },
        }}
        multiline={false}
      />
      <Input
        label="자기소개"
        placeholder="자기소개를 입력해주세요"
        type="text"
        size="lg"
        multiline={true}
      />
      <Input error="에러 메시지" multiline={false} />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        image="/Modal/book.svg"
        title="테스트 모달"
        content="이것은 테스트 모달입니다."
        buttons={[
          {
            label: '취소',
            variant: 'secondary',
            onClick: () => setIsModalOpen(false),
          },
          {
            label: '확인',
            variant: 'primary',
            onClick: () => setIsModalOpen(false),
          },
        ]}
      />
      <Modal
        isOpen={isModalOpen2}
        onClose={() => setIsModalOpen2(false)}
        title="단일 버튼 테스트 모달"
        content="단일 테스트 모달입니다."
        buttons={[
          {
            label: '확인',
            variant: 'primary',
            onClick: () => setIsModalOpen2(false),
          },
        ]}
      ></Modal>
      <Modal
        isOpen={isModalOpen3}
        onClose={() => setIsModalOpen3(false)}
        variant="bottom"
        title="하단 모달"
        content="하단에 위치하는 모달입니다."
        buttons={[
          {
            label: '확인',
            variant: 'primary',
            onClick: () => setIsModalOpen3(false),
          },
        ]}
      ></Modal>
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
