import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './layouts/Footer/Footer'
import Header from './layouts/header/Header'
import Community from './pages/Community'
import Home from './pages/Home'
import StudyGroup from './pages/StudyGroup'
import Chat from './pages/Chat'
import User from './pages/User'
import List from './components/List'
import type { ChatItem, PostItem } from './components/List'

const sampleChatItems: ChatItem[] = [
  {
    id: 1,
    name: '홍길동',
    lastMessage: '안녕하세요! 오늘 스터디 어떠셨나요?',
    timestamp: '10:30',
    unreadCount: 3,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: '김철수',
    lastMessage: '오늘 스터디 몇 시예요?',
    timestamp: '09:15',
    unreadCount: 0,
  },
  {
    id: 3,
    name: '이영희',
    lastMessage: '과제 다들 다 하셨나요?',
    timestamp: '어제',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
]

const samplePostItems: PostItem[] = [
  {
    id: 1,
    name: '이영희',
    title: 'React TDD 정리',
    detail:
      '오늘 TDD를 공부하면서 느낀 점을 정리해봤습니다. Vitest와 Testing Library를 조합하면 정말 편하더라고요.',
    timestamp: '2024-01-01',
    likes: 10,
    comments: 5,
    thumbnail: 'https://picsum.photos/seed/react/200',
    tag: ['React', 'TDD', 'Vitest'],
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 2,
    name: '박민수',
    title: 'Vitest 입문',
    detail:
      'Vitest 사용법을 알아봅시다. Jest와 거의 호환되면서 Vite 환경에 최적화되어 있습니다.',
    timestamp: '2024-01-02',
    likes: 7,
    comments: 2,
    tag: ['Vitest'],
  },
  {
    id: 3,
    name: '최지훈',
    title: '썸네일 없는 게시글 예시',
    detail: '썸네일 없이도 잘 표시되는지 확인하는 게시글입니다.',
    timestamp: '2024-01-03',
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
]

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
          <Route
            path="/list-preview"
            element={
              <div
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '32px',
                }}
              >
                <section>
                  <h2
                    style={{
                      marginBottom: '8px',
                      fontSize: '1rem',
                      fontWeight: 700,
                    }}
                  >
                    Chat List
                  </h2>
                  <List
                    variant="chat"
                    items={sampleChatItems}
                    onItemClick={item => alert(`클릭: ${item.name}`)}
                  />
                </section>

                <section>
                  <h2
                    style={{
                      marginBottom: '8px',
                      fontSize: '1rem',
                      fontWeight: 700,
                    }}
                  >
                    Chat List — 빈 상태
                  </h2>
                  <List
                    variant="chat"
                    items={[]}
                    emptyMessage="채팅이 없어요"
                  />
                </section>

                <section>
                  <h2
                    style={{
                      marginBottom: '8px',
                      fontSize: '1rem',
                      fontWeight: 700,
                    }}
                  >
                    Post List
                  </h2>
                  <List
                    variant="post"
                    items={samplePostItems}
                    onItemClick={item => alert(`클릭: ${item.title}`)}
                  />
                </section>

                <section>
                  <h2
                    style={{
                      marginBottom: '8px',
                      fontSize: '1rem',
                      fontWeight: 700,
                    }}
                  >
                    Post List — 빈 상태
                  </h2>
                  <List variant="post" items={[]} />
                </section>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App
