import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './esg-dashboard' // 👈 뒤에 붙은 .jsx를 지워서 확장자 없이 이름만 남겨줍니다.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
