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
      <div className='flex flex-col items-center mt-10 mb-5'>
        <h1 dir='rtl' className='w-11/12 md:w-1/2 text-center font-semibold text-2xl md:text-3xl'>
          آموزش زبان انگلیسی با استفاده از زیرنویس فیلم های سینمایی و سریالی
        </h1>
        <h3 dir='rtl' className='w-11/12 md:w-2/3 text-center md:text-lg my-10'>
          <span>
            یادگیری زبان انگلیسی با استفاده از فیلم های سینمایی یکی از بهترین راهکار ها برای به چالش کشیدن دانش زبان آموز و یادگیری موثر می باشد.
          </span>
          <span>
            این ابزار به شما کمک می کند تا فیلم هایی را که با سطح زبانی شما هماهنگ می باشند را پیدا کرده
          </span>
          <span> </span>
          <span>
            و یا کلمات جدید به کار رفته در فیلم مورد نظر خود را قبل از مشاهده آن، تمرین کنید
          </span>
          .
        </h3>
        <h3 dir='rtl' className='text-center mx-3'>
          <span>میزان دقت مورد نظر برای تشخیص کلمات دشوار را وارد کنید:</span>
          <span className='font-semibold'> {levelValue}%</span>
        </h3>
        <div className='w-11/12 md:w-1/2 flex flex-row'>
          <h6 className='mx-2 font-semibold'>مبتدی</h6>
          <input className='w-full'
            onChange={(event) => { setLevelValue(+event.target.value) }}
            type="range"
            step="0.1"
            min="0"
            max="99"
            value={levelValue} />
          <h6 className='mx-2 font-semibold'>پیشرفته</h6>
        </div>
        <div className='md:w-1/2 p-4'>
          <h3 dir='rtl' className='p-4 rounded-md text-gray-600' style={{ backgroundColor: "#cce5ff" }}>
            میزان مهارت زبان آموزان بر اساس تعداد کلماتی که به آن آشنایی دارند شناخته می شود. کاربران می توانند با انتخاب میزان توانایی خود یک مقدار بین 0 تا 100 را انتخاب کنند این مقیاس بین 5 تا 50 هزار کلمه متغیر است و نتایج نهایی بر این اساس مشخص می گردد.
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
                  <h3 dir='rtl' className='p-4 rounded-md text-right text-gray-600' style={{ backgroundColor: "#cce5ff" }}>
                    برای آغاز پردازش فایل زیرنویس خود را در قسمت مشخص شده بارگزاری نمایید. فایل های آپلود شده باید به فرمت srt و به زبان انگلیسی باشند. فایل های زیرنویس می توانند از هر نوع منبعی تهیه شده باشند اما برای تجربه بهتر می توانید از زیرنویس های opensubtitle استفاده کنید.
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
      <div className='text-right text-black md:mx-40 sm:mx-20 mx-3 mt-5'>
        <h3 className='font-bold my-2 text-2xl'>منابع</h3>
        <hr />
        <h3 className='my-2' dir='rtl'>
          <span>
            مجموعه فرکانس کلمات: 
          </span>
          <a href='https://www.kaggle.com/datasets/rtatman/english-word-frequency'> https://www.kaggle.com/datasets/rtatman/english-word-frequency</a>
        </h3>
      </div>
    </>
  )
}

export default Main
