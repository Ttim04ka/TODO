import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import styles from '../../../styles/Main/main.module.scss';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useDispatch, useSelector } from 'react-redux';
import { changeValueCreator, createTaskCreator, setFlagForSelectedDate,correctStyle, setWindow } from '../../../reducers/plained-reducer';
import 'react-calendar/dist/Calendar.css';
import Task from './Task';
import '../../../App.css'
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';



let Plained=React.memo((props)=>{

    let dispatch=useDispatch();
    let data=useSelector(store=>store.plainedReducer.date);//дата,выбранная в календаре
    let flag=useSelector(store=>store.plainedReducer.flagForSelectedDate);// флаг для фильтрации задач по конкретному участку времени
    let inputFormBeauty=classNames(styles.btn,styles.btn__primary,styles.btn__inside,styles.uppercase)//класс для инпута ввода задач  

    
    let tasks=useSelector(store=>store.plainedReducer.tasks).map(item=>
        <Task task={item} key={Math.random()} check={false} line={false} flag={flag}></Task>
    );

 

    let completedTasks=useSelector(store=>store.plainedReducer.completedTasks.map(item=>
        <Task task={item.current} key={Math.random()} check={true} line={true} flag={''} ></Task>
    ));

    
    
    
    function changeValue(e){
        dispatch(changeValueCreator(e.currentTarget.value));
    }

    function createTask(){
        let taskName=document.getElementById('inputValue').value;
        if(taskName!==''){
            dispatch(createTaskCreator(taskName));
        }else{
            alert('Введите название задачи')
        };  
    };


    let selectData=(e)=>{
        let dropBtn=document.getElementById('dropdown-basic-button');
        dispatch(correctStyle(false))
        dropBtn.innerHTML=e.substr(1);
        if(e==="#Сегодня"){
            dispatch(setFlagForSelectedDate("#Сегодня"))
            data.filter(item=>item.date.split(',')[0]===new Date().toLocaleDateString());
        }else if(e==="#Завтра"){
            dispatch(setFlagForSelectedDate("#Завтра"))
        }else{
            dispatch(setFlagForSelectedDate(''));
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
    //конец
   
    let newKey=(e)=>{
        
        if(e.keyCode === 13){
            e.preventDefault();
            createTask();
        } 
    };//создание задачи по нажатии Enter
        
    return (
        <div className="keepLeft" >
            <div className={styles.selectDataTask}>
                <DropdownButton id="dropdown-basic-button" title="Выбрать период" onSelect={selectData} variant='secondary'>
                    <Dropdown.Item href="#Сегодня">Сегодня</Dropdown.Item>
                    <Dropdown.Item href="#Завтра">Завтра</Dropdown.Item>
                    <Dropdown.Item href="#Весь" >Весь</Dropdown.Item>
                </DropdownButton>
            </div>
            <div className={styles.mainTasks}>
               {tasks }
            </div>
            <div>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Завершенные задачи</Accordion.Header>
                        <Accordion.Body id='completedTasks'>
                            {completedTasks}
                        </Accordion.Body>
                </Accordion.Item></Accordion>
    
            </div>
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
        </div>
        
       
        
    );
});


export default Plained