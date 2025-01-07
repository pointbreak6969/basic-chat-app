import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import apiClient from "@/lib/client-api"
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "@/utils/constants"
import { useNavigate } from "react-router-dom"
const Auth = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")  
  const validateLogin = ()=>{
    if (!email.length) {
      toast.error("Email is required")
      return false
    }
    if (!password.length && password.length < 6) {
      toast.error("Password is required and must be atleast 6 characters")
      return false
    }
    return true;
  }
  const validateSignup = () =>{
    if (!email.length) {
      toast.error("Email is required")
      return false
    }
    if (!password.length && password.length < 6) {
      toast.error("Password is required and must be atleast 6 characters")
      return false
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    return true;
  }
  const handleLogin =async ()=>{
    if (validateLogin()) {
      const response = await apiClient.post(LOGIN_ROUTE, {email, password}, {withCredentials: true})
      if (response.data.user.id) {
        if (response.data.user.profileSetup)   navigate("/chat")
        
      } else navigate("/profile")
    }
  }
  const handleSignup = async ()=>{
    if (validateSignup()) { 
      const response = await apiClient.post(SIGNUP_ROUTE, {email, password}, {withCredentials: true}) 
    }
  }
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2" >
        <div className="flex flex-col justify-center items-center gap-10">
          <div className="flex items-center justify-center flex-col"> 
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold text-center md:text-6xl">Welcome</h1>
            </div>
            <p>Register</p>
          </div>
          <div className="flex flex-items justify-center w-full">
            <Tabs className="w-3/4">
              <TabsList className="bg-transparent rounded-none w-full ">
                <TabsTrigger value="signup" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Signup</TabsTrigger>
                <TabsTrigger  value ="login" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Login</TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input className="rounded-full p-6" placeholder="email" type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                <Input placeholder="password" type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                <Button onClick={handleLogin} className="rounded-full p-6">Login</Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 " value="signup" >
                <Input placeholder="email" type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                <Input placeholder="password" type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                <Input placeholder="confirm Password" type="password" value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
                <Button onClick={handleSignup} className="rounded-full p-6">Signup</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="flex"></div>
      </div>

    </div>
  )
}
export default Auth