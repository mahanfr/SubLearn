import React from 'react'
import { FileUploader } from 'react-drag-drop-files'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Result from './Result'
import {invoke} from '@tauri-apps/api'

interface IProps{
  onAlert: (msg:string,type:"Error"|"Warning"|"Info") => void,
  onWordListUpdate: () => void,
}

const Main = (props: IProps) => {
  const [fileUploader, setFileUploader] = React.useState(true);
  const [file, setFile] = React.useState<any>();
  const [levelValue, setLevelValue] = React.useState(50);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>();

  const handelFetchSubData = (file: any) => {
    setLoading(true);
    let form = new FormData()
    form.append("file", file);
    fetch('http://127.0.0.1:8000/api/subtitle/getsub', {
      method: 'POST',
      body: form,
    }).then((response) => response.json())
      .then((data) => {
        props.onAlert("عملیات موفق آمیز بود","Info")
        setData(data[0].data)
        setLoading(false);
      })
      .catch((error) => {
        console.log(error)
        // props.onError()
        props.onAlert("مشکلی در دریافت اطلاعات به وجود آمده","Error")
        setLoading(false);
      });
  }
  const onFileUpload = (file: any) => {
    setLoading(true);
    setFile(file);
    setFileUploader(false);
    const reader = new FileReader();
    reader.onload = (event:any) => {
        invoke('get_difficult_words',{data: event.target.result}).then(
            (res : any)=> {
                props.onAlert("عملیات موفق آمیز بود","Info")
                setData(JSON.parse(res))
                setLoading(false)
            }
        )
    }
    reader.readAsText(file)
    // handelFetchSubData(file);
  }

  return (
    <>
      <div className='flex flex-col items-center pt-10 mb-5'>
        <h1 className='w-11/12 md:w-1/2 text-center font-semibold text-2xl md:text-3xl'>
        Learn English Using Your Favourite Movies And Tv Shows
        </h1>
        <h3 className='w-11/12 md:w-2/3 text-center md:text-lg my-10'>
          <span>
            Movies and Tv Shows are one of the most affective ways to learn a new language like English.
          </span>
          <span>
            This tool helps you learn new words based on your preferred level
          </span>
          <span> </span>
          <span>
            or to practice new words of a movie before watching it for the first time
          </span>
          .
        </h3>
        <h3 dir='rtl' className='text-center mx-3'>
          <span>Please Enter Your Preferred Level:</span>
          <span className='font-semibold'> {levelValue}%</span>
        </h3>
        <div className='w-11/12 md:w-1/2 flex flex-row'>
          <h6 className='mx-2 font-semibold'>Elementary</h6>
          <input className='w-full'
            onChange={(event) => { setLevelValue(+event.target.value) }}
            type="range"
            step="0.1"
            min="0"
            max="99"
            value={levelValue} />
          <h6 className='mx-2 font-semibold'>Advanced</h6>
        </div>
        <div className='md:w-1/2 p-4'>
          <h3 className='p-3 rounded-md text-gray-600' style={{ backgroundColor: "#cce5ff" }}>
          The Preferred Level of user should be selected based on number of words in their vocabulary. This Scale can be adjusted between 5K to 300K words normlaized between 0 to 100.
          </h3>
        </div>

        {
          fileUploader ?
            <div>
              <div className='flex flex-col items-center text-center'>
                <FileUploader
                  handleChange={onFileUpload}
                  name="file"
                  maxSize={2}
                  types={["srt"]}
                />
                <p>subtile file *.srt</p>
                <div className='md:w-1/2 p-4'>
                  <h3 className='p-3 rounded-md text-left text-gray-600' style={{ backgroundColor: "#cce5ff" }}>
                  To Get Started please upload your srt file inside the highlighted section. For better support please use subtitle files downloaded from opensubtitle.org.
                  </h3>
                </div>
              </div>
            </div>
            :
            <div className='px-20 w-full flex flex-col items-center'>
              <div className='p-3 flex flex-row w-80 rounded-lg justify-between bg-orange-200'>
                {/* <p>{file?.name}</p> */}
                <p>{file?.name}</p>
                <div style={{ cursor: 'pointer' }} onClick={() => { setFileUploader(true) }} >
                  <FontAwesomeIcon icon={faXmark} fontWeight={700} />
                </div>
              </div>
              <Result 
                data={data}
                loading={loading}
                level={levelValue}
                onAlert={props.onAlert}
                onWordListUpdate={props.onWordListUpdate}
                onError={() => { setFileUploader(true) }}
                setMessage={(msg: string) => { console.log(msg) }} />
            </div>
        }
      </div>
      <div className='pb-20 text-left text-black md:mx-40 sm:mx-20 mx-3 mt-5'>
        <h3 className='font-bold my-2 text-2xl'>Sources</h3>
        <hr />
        <h3 className='my-2'>
          <span>
          English Word Frequency:
          </span>
          <a href='https://www.kaggle.com/datasets/rtatman/english-word-frequency'> https://www.kaggle.com/datasets/rtatman/english-word-frequency</a>
        </h3>
      </div>
    </>
  )
}

export default Main
