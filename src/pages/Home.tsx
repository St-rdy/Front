import React from 'react'
import SelectButton from '../layouts/selectbutton/SelectButton'

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <section className="section">
        <div style={{ display: 'flex', gap: '10px' }}>
          <SelectButton type="radio" name="option" value="A" color="primary">
            옵션 A
          </SelectButton>
          <SelectButton type="radio" name="option" value="B" color="secondary">
            옵션 B
          </SelectButton>
          <SelectButton type="radio" name="option" value="B" color="primary">
            옵션 C
          </SelectButton>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <SelectButton type="checkbox" name="skill" value="react1">
            React 1
          </SelectButton>
          <SelectButton type="checkbox" name="skill" value="react2">
            React 2
          </SelectButton>
          <SelectButton type="checkbox" name="skill" value="react3">
            React 3
          </SelectButton>
        </div>
      </section>
    </div>
  )
}

export default Home
