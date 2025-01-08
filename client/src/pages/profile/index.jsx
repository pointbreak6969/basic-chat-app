import { useAppStore } from "@/store"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const {userInfo} = useAppStore()
  const navigate = useNavigate()
  useEffect(()=>{
    if (!userInfo.profileSetup) {
      toast("Please complete your profile setup")
      navigate("/profile")
    }
  }, [userInfo, navigate])
  return (
    <div>Profile</div>
  )
}
export default Profile