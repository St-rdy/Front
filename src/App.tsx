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
import ChatItems from './components/List/__mocks__/chatItems.json'
import PostItems from './components/List/__mocks__/postItems.json'

const sampleChatItems: ChatItem[] = ChatItems
const samplePostItems: PostItem[] = PostItems

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
