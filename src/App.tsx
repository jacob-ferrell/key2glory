import { useState } from 'react'
import test1 from './assets/test-strings/test1'
import test2 from './assets/test-strings/test2'
import test3 from './assets/test-strings/test3'
import './App.css'
import Game from './pages/Game/Game'

function App() {

  return (
    <>
      <Game text={test3} />
    </>
  )
}

export default App
