import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from '../../../styles/Main/main.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { changeValueCreator, chooseDate, createTaskCreator, setFlagForSelectedDate } from '../../../reducers/plained-reducer';
import 'react-calendar/dist/Calendar.css';
import Task from './MyTask';


let MyDay=React.memo((props)=>{
    let dispatch=useDispatch();
    
       
    let options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timezone: 'UTC'
    }; // изменяет дату в нужный формат

    
    let tasks=useSelector(store=>store.plainedReducer.tasks).map(item=>
        <Task task={item} key={Math.random()} check={false} line={false} flag={"#Сегодня"} ></Task>
    );

    
    function changeValue(e){
        dispatch(changeValueCreator(e.currentTarget.value));
    };

    function createTask(){
        let taskName=document.getElementById('inputValue').value;
        if(taskName!==''){
            dispatch(createTaskCreator(taskName));
            dispatch(chooseDate(taskName,`${new Date().toLocaleString("ru", options)},${new Date().toLocaleString("ru", {weekday:"long" })}`));
        }else{
            alert('Введите название задачи')
        };  
    };


    

   
    let newKey= (e)=>{
        if(e.keyCode === 13){
            createTask();
        } 
    };//создание задачи по нажатии Enter
        
   


    return (
        <div className="keepLeft" >
            <div>
               {tasks }
            </div>
            <div className={styles.createTask}> 
                <InputGroup className='aaa'>
                    <Form.Control
                        placeholder="Название задачи"
                        aria-label="Название задачи"
                        aria-describedby="basic-addon2"
                        onChange={changeValue}
                        id='inputValue'
                        value={useSelector(store=>store.plainedReducer.inputValue)}
                        onKeyDown={newKey}
                    />
                    <Button variant="outline-secondary" id="button-addon2" onClick={createTask}>
                        Создать
                    </Button>
                </InputGroup>
            </div>
        </div>
        
       
        
    );
});


export default MyDay