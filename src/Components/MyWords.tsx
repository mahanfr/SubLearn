import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';

const MyWords = () => {
  const [wordsList, setWordsList] = React.useState([]);

  const retriveWord = () => {
    const words_obj = localStorage.getItem('words')
    if (words_obj !== null) {
      let words = JSON.parse(words_obj) || []
      if (!(words instanceof Array))
        words = [words]
      setWordsList(words)
    }
  }

  const removeWord = (word: string) => {
    const words_obj = localStorage.getItem('words')
    if (words_obj !== null) {
      let words = JSON.parse(words_obj) || []
      if (!(words instanceof Array))
        words = [words]
      for (const index in words) {
        if (words[index].word === word) {
          words.splice(index, 1)
          break
        }
      }
      localStorage.setItem('words', JSON.stringify(words));
      setWordsList(words)
    }
  }

  React.useEffect(retriveWord, [])
  return (
    <>
      <div className='pt-5' style={{backgroundColor: "#2f6ea3"}}>
        {wordsList.length > 0 ? 
        <>
        <h3 dir='rtl' className='text-white mx-5 my-3 md:mx-20 font-bold text-xl'>کلمات من:</h3>
        <div className='overflow-x-auto' style={{whiteSpace:"nowrap"}}>
          {wordsList?.map((item: any, index: number) => {
            return (
              <div className='w-80 mx-2 inline-block py-2' style={{verticalAlign:"top"}} key={index}>
                <div className='flex flex-row justify-between items-center bg-gray-300 py-2 px-4 rounded-t-md'>
                  <h3 className='font-bold text-xl'>{item.word}</h3>
                  <FontAwesomeIcon onClick={()=>{removeWord(item.word)}} className='text-xl text-red-500 cursor-pointer' icon={faMinus} />
                </div>
                <div className='bg-gray-200 p-2 h-32 text-ellipsis' style={{whiteSpace:"normal"}} >
                  <h3>{item.definition}</h3>
                </div>
              </div>
            )
          })}
        </div>
          </>
        :
          <h3 dir='rtl' className='text-center text-white pb-5 font-bold text-xl'>کلمه ای برای نمایش وجود ندارد</h3>
        }
      </div>
    </>
  )
}

export default MyWords