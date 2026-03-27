import { useState } from 'react'
import './SignUpPage.css'
import { Input } from '../../../components/Input/Input'
import Button from '../../../layouts/button'
import { useNavigate } from 'react-router'
export default function SignUpPage() {
  const [userName, setUserName] = useState('') // 이름 상태
  const [userNickName, setUserNickName] = useState('') // 닉네임 상태
  const [isNickNameChecked, setIsNickNameChecked] = useState(false) // 닉네임 유효성 검사 상태
  const [nickNameError, setNickNameError] = useState('') // 닉네임 오류 상태

  const navigate = useNavigate()

  // 닉네임 유효성 검사
  const handleNickNameChecked = () => {
    if (userNickName.trim() === '') {
      setNickNameError('닉네임을 입력해주세요.')
      return
    }
    if (userNickName.length < 3) {
      setNickNameError('닉네임은 3자 이상이어야 합니다.')
      return
    }
    if (userNickName.length > 20) {
      setNickNameError('닉네임은 20자 미만이어야 합니다.')
      return
    }
    setIsNickNameChecked(true)
    setNickNameError('') // 오류 메세지 초기화
  }

  // 제출 버튼 활성화 여부
  // 공백을 제거한 후 이름과 닉네임이 모두 입력되어야 제출 버튼이 활성화가 됩니다.
  const isSubmitDisabled =
    userName.trim() === '' || userNickName.trim() === '' || !isNickNameChecked

  const handleSubmit = () => {
    if (!isNickNameChecked) {
      return
    }
    navigate('/auth/signup-complete')
  }

  return (
    <div className="sign-up-container">
      <div className="sign-up-top-container">
        <div className="sign-up-title-container">
          <div className="sign-up-title">처음이신가요?</div>
          <div className="sign-up-sub-title">
            스터디와 커뮤니티에서 사용할 이름과 닉네임을 알려주세요
          </div>
        </div>

        <Input
          label="이름"
          placeholder="이름을 입력해주세요."
          multiline={false}
          size="md"
          value={userName}
          onChange={e => setUserName(e.target.value)}
        />
        <Input
          label="닉네임"
          placeholder="닉네임을 입력해주세요."
          multiline={false}
          value={userNickName}
          onChange={e => setUserNickName(e.target.value)}
          error={nickNameError}
          rightAction={{
            label: '중복확인',
            onClick: () => {
              handleNickNameChecked()
            },
            loading: false,
          }}
        />
      </div>

      <div className="sign-up-bottom-sheet">
        <Button
          size="medium"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          입력했어요
        </Button>
        <div className="sign-up-bottom-sheet-hidden"></div>
      </div>
    </div>
  )
}
