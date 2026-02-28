import Footer from './layouts/Footer/Footer'
import { Input } from './components/Input'

function App() {
  return (
    <>
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
      <Footer />
    </>
  )
}

export default App
