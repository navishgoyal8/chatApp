import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import {HiDotsVertical} from 'react-icons/hi'
import { FaAngleLeft } from 'react-icons/fa'
import {FaPlus} from 'react-icons/fa6'
import {FaImage} from 'react-icons/fa6'
import {FaVideo} from 'react-icons/fa6'
import uploadFile from '../helpers/uploadFile'
import { IoClose } from 'react-icons/io5'
import Loading from './Loading'
import Wallpaper from '../assets/wallapaper.jpeg'
import {IoMdSend} from 'react-icons/io'
import moment from 'moment'

const MessagePage = () => {

  const params = useParams()
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const user = useSelector(state => state?.user)
  const [dataUser,setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    _id: "",
    online: false
  })
  const [openImageVideoSection,setOpenImageVideoSection] = useState(false)
  const [message,setMessage] = useState({
    text : "",
    imageURL : "",
    videoURL : ""
  })
  const [loading,setLoading] = useState(false)
  const [allMessage,setAllMessage] = useState([])
  const currentMessage = useRef()

  useEffect(() => {
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({behavior: 'smooth',block:'end'})
    }
  },[allMessage])

  const handleUploadImage = async(e) => {
    const file = e.target.files[0]
    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoSection(false)
    
   setMessage((preve) => {
    return {
      ...preve,
      imageURL : uploadPhoto?.url
    }
   })
  
}

const handleClearImage = () =>{

   setMessage((preve) => {
    return {
      ...preve,
      imageURL : ""
    }
   })
}

  const handleUploadVideo = async(e) => {
     const file = e.target.files[0]
    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoSection(false)

   setMessage((preve) => {
    return {
      ...preve,
      videoURL : uploadPhoto?.url
    }
   })
  }

  const handleClearVideo = () => {

       setMessage((preve) => {
    return {
      ...preve,
      videoURL : ""
    }
   })
  }
  
  const handleSendMessage = (e) => {
    e.preventDefault()
    console.log("message",message)
    if(message.text || message.imageURL || message.videoURL){
      if(socketConnection){
        socketConnection.emit('new-message',{
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageURL: message.imageURL,
          videoURL: message.videoURL,
          msgByUserId: user?._id
      })
      setMessage({
        text: "",
        imageURL: "",
        videoURL: ""
      })
    }
  }
}

  useEffect(() =>{
    if(socketConnection){
      socketConnection.emit('message-page',params.userId)

      socketConnection.on('seen',params?.userId)

      socketConnection.on('message-user',(data) => {
        setDataUser(data)
      })

      socketConnection.on('message',(data) => {
        setAllMessage(data)
      })


    }
  },[socketConnection,params.userId,user])

  return (
    <div style={{backgroundImage: `url(${Wallpaper})`}} className='bg-no-repeat bg-cover'>
        <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
            <div className='flex items-center gap-4'>
              <Link to={"/"} className='lg:hidden'>
                <FaAngleLeft size={25} />
              </Link>
                <div>
                  <Avatar 
                    width={50}
                    height={50}
                    imageURL={dataUser?.profile_pic}
                    name={dataUser?.name}
                    userId={dataUser?._id}
                  />
                </div>
                <div>
                  <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
                  <p className='-my-2 text-sm'>
                    {
                      dataUser?.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>
                    }
                  </p>
                </div>
            </div>
            <div>
                <button className='cursor-pointer hover:text-primary'>
                    <HiDotsVertical />
                </button>
            
            </div>
        </header>

        {/*** show all messages ***/}
        <section className='h-[calc(100vh-120px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>

        
          
          {/** show all messages **/}
          <div  className='flex flex-col gap-2 py-2 mx-1' ref={currentMessage}>
          {
            allMessage?.map((msg,index) => {
              return (
                <div  className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                  <div className='w-full'>
                  {
                    msg?.imageURL && (
                      <img 
                        src={msg.imageURL}
                        className='aw-full h-full object-scale-down'
                        alt='image'
                      />
                    )
                  }
              
                  {
                    msg?.videoURL && (
                      <video 
                        src={msg.videoURL}
                        className='aw-full h-full object-scale-down'
                        controls
                      />
                    )
                  }
                  </div>
                  <p className='px-2'>{msg.text}</p>
                  <p className='text-sm ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>
                </div>
              )
            })
          }
          </div>

            {/**  upload image display**/}

          {
            message?.imageURL && (
              <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex items-center justify-center rounded overflow-hidden'>
              <div onClick={handleClearImage} className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600'>
                <IoClose size={30}  />
              </div>
             <div className='bg-white p-3'>
                    <img 
                      src={message?.imageURL}
                      className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                      alt='uploadImage'
                    />
             </div>

          </div>
            )
          }

           {/**  upload video display**/}

          {
            message?.videoURL && (
              <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex items-center justify-center rounded overflow-hidden'>
              <div onClick={handleClearVideo} className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600'>
                <IoClose size={30}  />
              </div>
             <div className='bg-white p-3'>
                    <video 
                    src={message?.videoURL}
                    className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                    controls
                    muted
                    autoPlay
                    />
             </div>

          </div>
            )
          }

          {/**  show loading **/}
          {
            loading && 
            <div className='w-full h-full sticky bottom-0 flex items-center justify-center'>
              <Loading />
            </div>
          }

        </section>
        
        {/** send message **/}
        <section className='h-16 bg-white flex items-center px-4'>
            <div className='relative '>
                <button onClick={() => setOpenImageVideoSection(preve => !preve)} className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'>
                  <FaPlus size={20} />
                </button>

                {/** videos and images **/}
                
                {openImageVideoSection && (
                <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
                    <form>
                      <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                        <div className='text-primary'>
                          <FaImage size={18} />
                        </div>
                        <p>Image</p>
                      </label>

                      <label htmlFor='uploadVideo' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                        <div className='text-purple-500'>
                          <FaVideo size={18} />
                        </div>
                        <p>Video</p>
                      </label>

                    <input 
                      type='file'
                      id='uploadImage'
                      className='hidden'
                      onChange={handleUploadImage}
                    />  
                    <input 
                      type='file'
                      id='uploadVideo'
                      className='hidden'
                      onChange={handleUploadVideo}
                    />
                    </form>
                </div>
                ) 
              }
            </div>
            
            {/** input box  **/}
              <form className='w-full h-full flex gap-2'>
                
                  <input 
                    type='text'
                    placeholder='Type here message'
                    value={message?.text}
                    className='py-1 px-4 outline-none w-full h-full'
                    name='text'
                    onChange = {(e) => setMessage((preve) => {
                      return {
                          ...preve,
                          text : e.target.value
                        }
                      })}
                  />
                  <button className='text-primary hover:text-blue-500 ' onClick={handleSendMessage}>
                    <IoMdSend size={28} />
                  </button>
              
            </form>

        </section>

    </div>
  )
}



export default MessagePage
