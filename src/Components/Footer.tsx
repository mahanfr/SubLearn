import React from 'react'

const Footer = () => {

  const copyrigth_text = [
    "تمامی حقوق این برنامه متعلق به ",
    "دانشگاه صنعتی کرمانشاه ",
    "می باشد."
  ]
  const writer_text = "این برنامه توسط ماهان فرزانه و به راهنمایی دکتر وحید قاسمی طراحی شده است."

  return (
    <div className='absolute bottom-0 w-full'>
      <div className='h-3 w-full' style={{backgroundColor: "#E4AB23"}}></div>
      <div className='flex flex-col items-center justify-center py-3 px-5 md:h-16' style={{backgroundColor: "#1F486B"}}>
        <small dir='rtl' className='text-center text-gray-200 mb-1'>
          {writer_text}
        </small>
        <small dir='rtl' className='text-center text-gray-300'>
          <span>
            {copyrigth_text[0]}
          </span>
          <a className='text-blue-300' href='https://kut.ac.ir'>
            {copyrigth_text[1]}
          </a>
            {copyrigth_text[2]}
        </small>
      </div>
    </div>
  )
}

export default Footer