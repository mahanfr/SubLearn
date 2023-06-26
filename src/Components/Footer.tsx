import React from 'react'

const Footer = () => {

  const writer_text = "This Program has been published and developed by Mahan Farzaneh with the help of Dr. Vahid Ghasemi Under Kermanshah Univercity of Technology Institution"

  return (
    <div className='absolute bottom-0 w-full'>
      <div className='h-3 w-full' style={{backgroundColor: "#E4AB23"}}></div>
      <div className='flex flex-col items-center justify-center py-3 px-5 md:h-16' style={{backgroundColor: "#1F486B"}}>
        <small className='text-center text-gray-200 mb-1'>
          {writer_text}
        </small>
        <small className='text-gray-200'>
        All Rights Reserved© 2022-2023
        </small>
      </div>
    </div>
  )
}

export default Footer
