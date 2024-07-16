import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Avatar from '../components/Avatar'
import { useDispatch } from 'react-redux'
import { setToken, setUser } from '../redux/userSlice'

const CheckPasswordPage = () => {

  const [data,setData] = useState({
    password: "",
    userId: ""
  })

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    if(!location?.state?.name){
      navigate('/email')
    }
  },[])

const handleOnChange = (e) => {
    const {name, value} = e.target
    setData((preve) => {
      return {
      ...preve,
      [name]: value,
    }
  })
}

console.log(data)

const handleSubmit = async(e) => {
  e.preventDefault()
  e.stopPropagation()
  
  const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`
  
  try{
    const response = await axios.post(URL,{
      password: data.password,
      userId: location?.state?._id
    })
    
    toast.success(response?.data?.message)
    
    if(response.data.success){

       dispatch(setToken(response?.data?.token))
      localStorage.setItem('token',response?.data?.token)

      setData({
        password: "",
      })
      
      navigate('/')
    }
  }
  catch(error){
    toast.error(error?.response?.data?.message)
  }
} 




  return (
    <div className='mt-5'>
     
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
         <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
            <Avatar 
              userId={location?.state?._id} 
              name={location?.state?.name} 
              imageURL={location?.state?.profile_pic}
              height={70}
              width={70}  
              />
              <h2 className='font-semibold text-lg mt-1'>{location?.state?.name}</h2>
      </div>
        <h3>Welcome to Chat App!</h3>
        <form className='grid gap-4' onSubmit={handleSubmit}>
         

          <div className='flex flex-col gap-1 mt-3'>
            <label htmlFor='password'>Password:</label>
            <input 
              type= 'password'
              name='password'
              id= 'password'
              placeholder='enter your password'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value = {data.password}
              onChange = {handleOnChange} 
              required
            />
          </div>

          <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'>
            Login
          </button>

        </form>

        <p className='my-3 text-center'><Link to={"/forgot-password"} className='hover:text-primary font-semibold'>Forgot Password ?</Link></p>
        </div>

      </div>
  
  )
}

export default CheckPasswordPage