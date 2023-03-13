import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios'
import './App.css';

function App() {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };




  const [tasks, settasks] = useState([])  
  const [taskData, setTaskData] = useState([])
  const [manData, setManData] = useState({
    "id": 0,
    "title": "",
    "description": "",
    "completed": false
  })
  const [open, setOpen] = useState(false);
  const [inC, setCom] = useState(false);


  const handleClose = () => setOpen(false);

  const onAddItem = () => {
    setOpen(true)
    setManData({
      "id": 0,
      "title": "",
      "description": "",
      "completed": false
    })
  };

    

  const handleComplete = () => {
    setCom(true)
    setTaskData(tasks.filter(item => item.completed === true))
  };
  const handleInComplete = () => {
    setCom(false)
    setTaskData(tasks.filter(item => item.completed === false))
  };
  const editItem = (datas) => {
    setOpen(true)
    let data = taskData.find(item=>item.id === datas.id)
    setManData({
      "id": data.id,
      "title": data.title,
      "description": data.description,
      "completed": data.completed
    })
  };

  const handleSubmit = () => {
   console.log(manData);
    if( manData.id !==0){
      axios.put(`http://localhost:8000/api/tasks/${manData.id}/`, manData).then(res=>getData())
    }else{
      axios.post(`http://localhost:8000/api/tasks/`, manData).then(res=>getData()) 
    }
    setOpen(false)
  };
  const deleteItem = (id) => {
    axios.delete(`http://localhost:8000/api/tasks/${id}/`).then(res=>getData())
  };

const getData = ()=>axios.get("http://localhost:8000/api/tasks/").then(res=>settasks(res.data)).catch(err=>console.log(err))


  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if(!inC){
    setTaskData(tasks.filter(item => item.completed === false))}
    else if (inC){
      setTaskData(tasks.filter(item => item.completed === true))
    }
  }, [tasks])


  return (
    <div className="App">
      <div className='container border p-3 rounded mt-5'>
        <h1>TASK MANAGER</h1>
        <Button variant="contained" className='mb-4' onClick={e=>onAddItem()}>Add Task</Button>
        <div className={`todo-title `}>
          <div className='tab-list mb-3'>
            <span onClick={handleComplete} className={`${inC?'bg-primary text-white':''}`}>
              Completed
            </span>
            <span onClick={handleInComplete} className={`${inC?"":'bg-primary text-white'}`}>
              Incompleted
            </span></div>
          {taskData.map(item => <>
            <div className=' rounded m-1 p-4 border text-dark bg-light d-flex align-items-center justify-content-between'>
              <span className={`${inC ? 'completed-todo' : ''}`}>{item.title}</span>

              <div className='d-flex gap-3'>
                <button className='btn btn-info text-white border-danger' onClick={e=>editItem(item)}>Edit</button>
                <button className='btn btn-danger text-white border-info'onClick={e=>deleteItem(item.id)} >Delete</button></div>
            </div>

          </>)}
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Task Item
          </Typography>
          <div className='w-100 d-flex flex-column gap-2' >
            <label>Title <input type={'text'} className='w-100' value={manData.title} onChange={e=>setManData({...manData,title:e.target.value})}/></label>
            <label>Description <input type={'text'} className='w-100' value={manData.description} onChange={e=>setManData({...manData,description:e.target.value})}/></label>
            <label> <input type={'checkbox'} value={manData.completed} checked={manData.completed} onChange={e=>setManData({...manData,completed:e.target.checked})}/> Completed</label>
            <div className='w-100 d-flex justify-content-end'><button variant="contained" onClick={e=>handleSubmit()}>Save</button></div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}



export default App;
