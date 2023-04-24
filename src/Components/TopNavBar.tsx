import React from 'react'
import kutLogo from "../assets/kutLogo.png"

interface IProps {
  onMyWordsClick : ()=>void
}

const TopNavBar = (props: IProps) => {
  return (
    <>
      <div className='py-2 px-5' style={{backgroundColor: "#1F486B"}}>
          <div className='flex flex-row content-center'>
              <button className='cursor-default flex-grow text-end'>
                <span style={{fontFamily: "reemkufi-regular"}} className='text-2xl mx-5 font-bold text-white'>
                  ساب لرن 
                </span>
              </button>
              <img className='w-16' src={kutLogo} alt='kermanshah university of technology' />
          </div>
      </div>
      <div className='h-3 w-full' style={{backgroundColor: "#E4AB23"}}></div>
    </>
  )
}

export default TopNavBar
