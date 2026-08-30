import { useState } from 'react'
import './SignUpPage.css'
import { Input } from '../../../components/Input/Input'
import Button from '../../../layouts/button'
import { useNavigate } from 'react-router-dom'
import { useCheckNickname, useSignUp } from '../../../hooks/useAuth'

export default function SignUpPage() {
  const [userName, setUserName] = useState('') // 이름 상태
  const [userNickName, setUserNickName] = useState('') // 닉네임 상태
  const [isNickNameChecked, setIsNickNameChecked] = useState(false) // 닉네임 중복확인 통과 여부
  const [nickNameError, setNickNameError] = useState('') // 닉네임 오류 상태
  const [nickNameNotice, setNickNameNotice] = useState('') // 사용 가능 안내
  const [submitError, setSubmitError] = useState('')

  const navigate = useNavigate()
  const checkNickname = useCheckNickname()
  const signUp = useSignUp()

  // 닉네임 형식 검사 후 서버에 중복 확인을 요청합니다.
  const handleNickNameChecked = () => {
    setNickNameNotice('')

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

    checkNickname.mutate(userNickName, {
      onSuccess: result => {
        if (result.available) {
          setIsNickNameChecked(true)
          setNickNameError('')
          setNickNameNotice(result.message)
        } else {
          setIsNickNameChecked(false)
          setNickNameError(result.message)
        }
      },
      onError: () => {
        setIsNickNameChecked(false)
        setNickNameError('중복 확인에 실패했어요. 다시 시도해주세요.')
      },
    })
  }

  // 닉네임을 다시 고치면 중복확인을 무효화합니다.
  const handleNickNameChange = (value: string) => {
    setUserNickName(value)
    setIsNickNameChecked(false)
    setNickNameNotice('')
    setNickNameError('')
  }

  // 제출 버튼 활성화 여부
  // 공백을 제거한 후 이름과 닉네임이 모두 입력되고 중복확인까지 끝나야 활성화됩니다.
  const isSubmitDisabled =
    userName.trim() === '' ||
    userNickName.trim() === '' ||
    !isNickNameChecked ||
    signUp.isPending

  const handleSubmit = () => {
    if (isSubmitDisabled) {
      return
    }
    setSubmitError('')
    signUp.mutate(
      { name: userName.trim(), nickname: userNickName.trim() },
      {
        onSuccess: () => navigate('/auth/signup-complete', { replace: true }),
        onError: () =>
          setSubmitError('가입에 실패했어요. 잠시 후 다시 시도해주세요.'),
      }
    )
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
          onChange={e => handleNickNameChange(e.target.value)}
          error={nickNameError}
          rightAction={{
            label: '중복확인',
            onClick: () => {
              handleNickNameChecked()
            },
            loading: checkNickname.isPending,
          }}
        />
        {nickNameNotice && (
          <p className="sign-up-notice" role="status">
            {nickNameNotice}
          </p>
        )}
        {submitError && (
          <p className="sign-up-error" role="alert">
            {submitError}
          </p>
        )}
      </div>

      <div className="sign-up-bottom-sheet">
        <Button
          size="medium"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          {signUp.isPending ? '가입 중...' : '입력했어요'}
        </Button>
        <div className="sign-up-bottom-sheet-hidden"></div>
      </div>
    </div>
  )
}
