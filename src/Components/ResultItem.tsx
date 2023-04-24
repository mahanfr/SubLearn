import React from 'react'

interface IProps {
  index: number,
  item: any,
  onAlert: (msg:string,type:"Error"|"Warning"|"Info") => void,
  onWordListUpdate: () => void,
}

const ResultItem = (props: IProps) => {

  const firstCharUpper = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }

  return (
    <div 
      className='flex flex-col bg-gray-200 hover:bg-gray-300 my-3 rounded-md' 
      key={props.index}>
      <div>
        <div className='flex flex-row items-center justify-between px-3'>
          <div className='flex my-3'>
            <h5 className='text-lg font-semibold'>{firstCharUpper(props.item.word)}</h5>
          </div>
          <div className='text-xl mx-2 algin-start'>
          </div>
        </div>
        {/* <FontAwesomeIcon className='text-black text-2xl mx-1' icon={faArrowDown} /> */}
      </div>
      {/* {isOpen && */}
        <div className='px-5 py-3'>
          <h5 dir='rtl' className='font-bold text-sm'>معنی:</h5>
          {props.item.defenition === "" ? 
            "Not Available" : 
            props.item.defenition
          }
          <h5 dir='rtl' className='font-bold text-sm'>زمان مشاهده در فیلم:</h5>
          <h5 className='font-bold'>{props.item.time}</h5>
          <h5 dir='rtl' className='font-bold text-sm'>درصد سختی:</h5>
          <h5 className='font-bold'>% {props.item.sort_val.toFixed(3)}</h5>
        </div>
      {/* } */}
    </div>
  )
}

export default ResultItem
