import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './OnBoardingPage.css'

const SLIDES = [
  {
    image: '/Auth/OnBoarding/on_boarding_01.svg',
    title: '공부를 시작하는 순간부터 기록이 쌓여요',
    describe: '당신의 하루 학습을 기록해보세요',
  },
  {
    image: '/Auth/OnBoarding/on_boarding_02.svg',
    title: '공부할수록 레벨이 올라가요',
    describe: '공부하면서 경험치를 채우며 당신의 노력을 남겨보세요',
  },
  {
    image: '/Auth/OnBoarding/on_boarding_03.svg',
    title: '혼자여도, 함께여도 계속할 수 있어요',
    describe: '스터디 그룹을 만들거나 커뮤니티에서 학습을 응원하고 공유해봐요',
  },
]

const AUTO_SLIDE_INTERVAL = 3000

export default function OnBoardingPage() {
  // 현재 슬라이드의 인덱스 state
  const [currentIndex, setCurrentIndex] = useState(0)
  // 터치 시작 위치를 저장하기 위한 ref
  // ref란 컴포넌트의 상태가 변경되어도 값이 유지되는 변수
  const touchStartX = useRef<number>(0)
  const navigate = useNavigate()

  // 컴포넌트가 마운트될 때 자동으로 실행되도록 하는 useEffect 훅
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % SLIDES.length)
    }, AUTO_SLIDE_INTERVAL)

    return () => clearInterval(timer)
  }, [])

  // 스와이프 제스처를 감지 처음 터치한 위치를 touchStartX에 저장
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX
    if (diff < 50) {
      setCurrentIndex(prev => Math.min(prev + 1, SLIDES.length - 1))
    } else if (diff > -50) {
      setCurrentIndex(prev => Math.max(prev - 1, 0))
    }
  }

  return (
    <>
      <div className="onboarding-container">
        <div
          className="onboarding-slide-wrapper"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button onClick={() => navigate('/')}>{currentIndex}</button>
          OnBoardingPage
        </div>
      </div>
    </>
  )
}
