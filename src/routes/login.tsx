import { createFileRoute,useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})


function RouteComponent() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')  
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const handleSubmit : React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setError(null)
    const result = await authClient.signIn.email({ email, password })
    if (result.error) {
      setError("Invalid email or password")
      return
    }
    navigate({to:"/"});
  }


  return <div>
                <form onSubmit={handleSubmit}>                    
                    
                    <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" placeholder='Email' required />                   
                    <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" placeholder='Password' required />
                    <button >Login</button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
        </div>
}
