import React from 'react'
import Button from '../layouts/button/Button'

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <section className="section">
        <h2>home</h2>
        <Button variant="solid" color="primary" size="medium">
          solid
        </Button>
        <Button variant="outline" color="primary" size="medium">
          outline
        </Button>

        <Button variant="solid" color="secondary" size="medium">
          solid (sec)
        </Button>
        <Button variant="outline" color="secondary" size="medium">
          outline (sec)
        </Button>

        <Button variant="solid" color="primary" size="medium" state="inactive">
          solid 비활성화
        </Button>
        <Button
          variant="outline"
          color="secondary"
          size="medium"
          state="inactive"
        >
          outline 비활성화
        </Button>

        <Button variant="solid" color="primary" size="medium" state="loading">
          solid 비활성화
        </Button>
        <Button variant="outline" color="primary" size="medium" state="loading">
          outline 비활성화
        </Button>

        <Button size="small">Small</Button>
        <Button size="medium">Medium</Button>
        <Button size="large">Large</Button>
      </section>
    </div>
  )
}

export default Home
