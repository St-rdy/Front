import React from 'react'
import './SignUpCompletePage.css'
import Button from '../../../layouts/button'
import { useNavigate } from 'react-router-dom'

export default function SignUpCompletePage() {
  const navigate = useNavigate()
  return (
    <>
      <div className="sign-up-complete-container">
        <div className="sign-up-complete-title-container">
          <div className="sign-up-complete-main-title">
            이제 저희와 함께 공부해요
          </div>
          <div className="sign-up-complete-sub-title">
            학습 기록과 스터디 참여가 바로 가능해요
          </div>
        </div>

        <div className="sign-up-complete-img">
          <img
            src="/Auth/SignUpComplete/complete.png"
            alt="회원가입 축하 이미지"
          />
        </div>

        <Button
          variant="solid"
          size="medium"
          color="primary"
          state="active"
          onClick={() => navigate('/')}
        >
          시작할게요
        </Button>
      </div>
    </>
  )
}
