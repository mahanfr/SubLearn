import React from 'react'
import Footer from './Components/Footer';
import Main from './Components/Main';
import MyWords from './Components/MyWords';
import TopNavBar from './Components/TopNavBar'

const App = () => {
  const [myWordsTab,setMyWordsTab] = React.useState(false);
  const [alert, setAlert] = React.useState('');
  const [alertType, setAlertType] = React.useState<"Error"|"Warning"|"Info">("Info");

  const Alert = () => {
    React.useEffect(() => {
      const timer = setTimeout(() => {
        setAlert('');
      }, 3000);
      return () => clearTimeout(timer);
    },[]);
    
    if (alert.length < 1) {
      return null;
    }
  
    return (
      <div className={`fixed bottom-5 right-5 z-10 ${getAlertColor(alertType)} p-3`}>
        <h6 dir='rtl'>{alert}</h6>
      </div>
    )
  }

  const onSetAlert = (msg: string, type:"Error"|"Warning"|"Info") => {
    setAlert(msg)
    setAlertType(type)
  }

  const getAlertColor = (type:"Error"|"Warning"|"Info") => {
    if (type === "Error"){
      return "bg-red-100"
    }else if (type === "Warning") {
      return "bg-yellow-100"
    }else {
      return "bg-green-100"
    }
  }

  const onWordListUpdate = () => {
    setMyWordsTab(false)
  }

  return (
    <div style={{fontFamily:"vazirmatn-regular"}} className='relative min-h-screen bg-slate-100'>
      {alert.length > 0 &&
        <Alert/>
      }
      <section className='pb-20'>
        <TopNavBar onMyWordsClick={()=>{setMyWordsTab(!myWordsTab)}} />
        {myWordsTab && 
          <MyWords />
        }
        <Main onWordListUpdate={onWordListUpdate} onAlert={onSetAlert}/>
        <Footer />
      </section>
    </div>
  )
}

export default App