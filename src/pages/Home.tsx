import React from 'react'
import { Card } from '../components/Card'

const Home: React.FC = () => {
  // 직접 텍스트 데이터 배열 생성
  const cardData = [
    {
      id: 1,
      title: '새로운 프로젝트 시작하기',
      date: '2026.03.29',
    },
    {
      id: 2,
      title: '새로운 프로젝트 시작하기2',
      date: '2026.03.30',
    },
  ]

  const handleCardClick = (id: number | string) => {
    console.log(`클릭된 카드 ID: ${id}`)
  }

  return (
    <div className="home-container">
      <section className="section">
        <h2 className="section-title">학습 콘텐츠</h2>
        <div className="card-section-grid">
          {cardData.map(item => (
            <Card
              key={item.id}
              title={item.title}
              date={item.date}
              onClick={() => handleCardClick(item.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
