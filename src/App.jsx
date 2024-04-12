import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Board from './components/Board'


function App() {

      const canvasRef = useRef(null)
      const ctxRef = useRef(null)

      return (
            <div className='py-20 px-5 h-screen bg-blue-100'>
                  <h4>Clara board</h4>
                  <Board canvasRef={canvasRef} ctxRef={ctxRef} />
            </div>
      )
}

export default App
