import { useState, FormEvent } from 'react'
import './PasswordProtection.css'

interface PasswordProtectionProps {
  onPasswordCorrect: () => void
}

const CORRECT_PASSWORD = 'nmghzz110'

function PasswordProtection({ onPasswordCorrect }: PasswordProtectionProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // 检查 sessionStorage 中是否已认证
    return sessionStorage.getItem('authenticated') === 'true'
  })

  // 如果已认证，直接调用回调
  if (isAuthenticated) {
    onPasswordCorrect()
    return null
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem('authenticated', 'true')
      setIsAuthenticated(true)
      onPasswordCorrect()
    } else {
      setError('密码错误，请重试')
      setPassword('')
    }
  }

  return (
    <div className="password-protection">
      <div className="password-modal">
        <h2>🔒 请输入密码</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="输入密码..."
            autoFocus
            className="password-input"
          />
          {error && <div className="password-error">{error}</div>}
          <button type="submit" className="password-submit">
            确认
          </button>
        </form>
      </div>
    </div>
  )
}

export default PasswordProtection

