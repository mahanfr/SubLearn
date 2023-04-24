import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import React from 'react'
import ResultItem from './ResultItem';

interface IProps {
  data: any,
  setMessage: (message: string) => void,
  onAlert: (msg:string,type:"Error"|"Warning"|"Info") => void,
  level: number,
  loading : boolean,
  onError: () => void,
  onWordListUpdate: () => void,
}

const Result = (props: IProps) => {
  return (
    <div className='flex flex-col items-center mt-5'>
      {props.loading && !props.data ?
        <FontAwesomeIcon className='animate-spin text-6xl text-center' icon={faSpinner} />
        :
        <div className='grid md:grid-cols-2 lg:grid-cols-4 md:gap-4'>
          {/* {JSON.stringify(data.data)} */}
          {/* <h3 className='text-xl'>Difficult Words:</h3> */}
          {props.data?.uncommon?.sort((a:any,b:any)=> a.sort_val - b.sort_val).map((item: any, index: number) => {
            if(item.sort_val > props.level){
              return (
                <ResultItem 
                  onWordListUpdate={props.onWordListUpdate}
                  onAlert={props.onAlert}
                  item={item}
                  key={index}
                  index={index} />
              )
            }
            return <></>
          })}
        </div>
      }
    </div>
  )
}

export default Result