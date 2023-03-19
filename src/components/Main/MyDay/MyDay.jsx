import React, { useEffect, useState } from 'react';
import styles from '../../../styles/Main/main.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { changeValueCreator, chooseDate, correctStyle, createTaskCreator, setWindow } from '../../../reducers/plained-reducer';
import 'react-calendar/dist/Calendar.css';
import Task from './MyTask';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';


let MyDay=React.memo((props)=>{
    let dispatch=useDispatch();
    let inputFormBeauty=classNames(styles.btn,styles.btn__primary,styles.btn__inside,styles.uppercase)//класс для инпута ввода задач  
   
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

     /// обновление компоненты при смене url
    let location=useLocation();
    const [sportKeyLocation, setSportKeyLocation] = useState(location.pathname);
    useEffect(() => { 
        
            dispatch(correctStyle(false))
            dispatch(setWindow(false))
       
      }, [sportKeyLocation]);
    
    useEffect(() => { 
    setSportKeyLocation(location.pathname)
    }, [location.pathname]);
    ///конец
   
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
            <div> 
                <div className={styles.createTask}> 
                    <div className={styles.createTask_container}>
                            <div className={styles.container__item}>
                                <form className={styles.createTask_form}>
                                    <input type="text"  className={styles.createTask_form__field} maxLength="70"  placeholder="Название задачи" onChange={changeValue} id='inputValue' value={useSelector(store=>store.plainedReducer.inputValue)} onKeyDown={newKey} />
                                    <button type="button" className={inputFormBeauty} onClick={createTask} >Создать </button>
                                </form>
                            </div>
                    </div>
                </div>
                        {/*    <InputGroup className='aaa'>
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
                            </InputGroup> */}
            </div>
        </div>
        
       
        
    );
});


export default MyDay