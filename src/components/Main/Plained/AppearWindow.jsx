import React from 'react';
import Button from 'react-bootstrap/Button';
import styles from '../../../styles/Main/main.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {  setWindow,changeTaskTextCreator, chooseDate, chooseRepeate, hasNote, isCalculate, moveToActiveTasksAgain, moveToCompletedTask, deleteTaskCreator, cs, correctStyle } from '../../../reducers/plained-reducer';
import { useState } from 'react';
import { useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import classNames from 'classnames';





const AppearWindow=React.memo((props)=>{
    const [value, onChange] = useState(new Date()); // изменяет дату в календаре
    let dispatch=useDispatch();
    let activeTasks=useSelector(store=>store.plainedReducer.tasks); //активные задачи
    let note=useSelector(store=>store.plainedReducer.hasNote)?.filter(item=>item?.task===props.task)[0]?.note //заметки
    let isCalculated=useSelector(store=>store.plainedReducer.isCalendar); // проверка влючен ли календарь
    let data=useSelector(store=>store.plainedReducer.date)?.filter(item=>item.task===props.task)[0]?.date; // выбранная в календаре дата
    let [currentData,setCurrentData]=useState(data); // отпраляет корректную дату в redux
    let repeateDays=useSelector(store=>store.plainedReducer.repeate)?.filter(item=>item?.task===props.task)[0]?.days;//дни,которые были выбраны для повтора задачи
    let correct=useSelector(store=>store.plainedReducer.correctStyle);// корректирует стилисткику сжатия главного окна при открытии настроек
    let check=true;
    let line=props.line;//перечеркивающая линия
    let textarea_text_style=classNames(line ? styles.line: styles.appear_input_block_input);//применение нескольких классов к textarea
   
    let options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timezone: 'UTC'
    }; // изменяет дату в нужный формат


 
 


    (function changeCheckedInput(){
        activeTasks.forEach((item,i)=>{
            if(item===props.task){
                check=false;
                line=false
                
            }
        })
    })() // корректный вывод активных и завершенных задач


    let deleteTask=(e)=>{
        document.querySelector('.keepLeft').style.width="100%"
        document.querySelector('#inputValue').style.width="95%"
        dispatch(deleteTaskCreator(e.currentTarget.id));
        dispatch(setWindow(false));
        dispatch(correctStyle(false))
    };


    let changeTaskText=(e)=>{
        dispatch(changeTaskTextCreator(e.currentTarget.defaultValue,e.currentTarget.value));
        dispatch(setWindow(e.currentTarget.value,true));
    };

    let checkedTask=()=>{
        let nameComletedTask=document.getElementsByName(props.task)[0];
        if(props.check){
            dispatch(moveToActiveTasksAgain(nameComletedTask.name));
        }else{
            dispatch(setWindow(false));
            dispatch(correctStyle(false))
            dispatch(moveToCompletedTask(nameComletedTask.name))  
        }; 
    };

    let closeWindow=()=>{
        document.querySelector('#inputValue').style.width="95%"
        dispatch(setWindow(false));
        dispatch(correctStyle(false))
    };

    let addNote=(e)=>{
        dispatch(hasNote(props.task,e.currentTarget.value))
    };

    let setCalc=()=>{
        dispatch(isCalculate(true));
    };

    let getData=(e)=>{
        setCurrentData(e);
    };

    let hideCalendar=()=>{
        dispatch(isCalculate(false));
    };

    let saveData=(e)=>{
        if(currentData!==data){
            dispatch(chooseDate(props.task,`${currentData.toLocaleString("ru", options)},${currentData.toLocaleString("ru", {weekday:"long" })}`));
        };

        if(String(currentData.toLocaleString("ru", options)).split(',')[0]!==new Date().toLocaleString("ru", options)){
            dispatch(setWindow(false));
            dispatch(correctStyle(false))
        };
       
        dispatch(isCalculate(false));
    };

    let chooseRepeated=(e)=>{

        if(e.currentTarget?.style.backgroundColor=='blue'){
            e.currentTarget.style.backgroundColor='white';
        }else{
            e.currentTarget.style.backgroundColor='blue';
        };
    };

    let saveRepeatedd=()=>{
        
        let arr=[];
        document.querySelectorAll(`#B${props.task}Btnn`).forEach(item=>{
            if(item.style.backgroundColor==='blue'){
                arr.push(item.name)
            }
        });
        console.log(document.querySelectorAll(`#B${props.task}Btnn`))
        dispatch(chooseRepeate(props.task,arr));
    };

    useEffect(()=>{
        document.querySelectorAll(`#B${props.task}Btnn`).forEach((item,i)=>{
            repeateDays?.forEach(elem=>{
               
                if(item.name===elem){
                    item.style.backgroundColor='blue';
                };
                
                
            });
        });
    }) ; 
   
    return(

        <div className={styles.menu_settings}>
            <div className={styles.appear_input_block}> 
                <input type="checkbox"  onChange={checkedTask} checked={check} className={styles.appear_input_block_checkbox} />
                <textarea type="text" data-content={props.task}  defaultValue={props.task} name={props.task.toString()}  onBlur={changeTaskText} className={textarea_text_style} maxLength="70" rows="1"/>
            </div>
            <hr/>
           {isCalculated ?  <div className={styles.calendar}><Calendar onChange={onChange} value={value} onClickDay={getData} ></Calendar> <Button variant="outline-success" onClick={saveData}>Сохранить</Button>{''} <Button variant="outline-danger" onClick={hideCalendar}>Закрыть выбор даты</Button>{''} </div> : <span className={styles.calendar} onClick={setCalc}>{(data==='' || data===undefined) ? "Выбрать дату" : data }</span>}
           <hr/>
           <div>
                <span className={styles.calendar}>Повтор</span>
                <div className={styles.repeatData} >
                        <button className={styles.repeat_item} id={`B${props.task}Btnn`} onClick={chooseRepeated} name='Monday'>пн</button>
                        <button className={styles.repeat_item} id={`B${props.task}Btnn`} onClick={chooseRepeated} name='Tuesday'>вт</button>
                        <button className={styles.repeat_item} id={`B${props.task}Btnn`} onClick={chooseRepeated} name='Wednesday'>ср</button>
                        <button className={styles.repeat_item} id={`B${props.task}Btnn`} onClick={chooseRepeated} name='Thursday'>чт</button>
                        <button className={styles.repeat_item} id={`B${props.task}Btnn`} onClick={chooseRepeated} name='Friday'>пт</button>
                        <button className={styles.repeat_item} id={`B${props.task}Btnn`} onClick={chooseRepeated} name='Saturday'>сб</button>
                        <button className={styles.repeat_item} id={`B${props.task}Btnn`} onClick={chooseRepeated} name='Sunday'>вс</button>
                </div>
                <Button variant="outline-success" id={props.task}  onClick={saveRepeatedd}>Сохранить</Button>{''} 
            </div>
           <hr />
           <div>
                <textarea name="" id="" cols="45" rows="2" placeholder='Оставить заметку' defaultValue={note ?? ''} onBlur={addNote} ></textarea>
           </div>
           <div className={styles.appear_btns}> 
                <Button variant="outline-danger" id={props.task}  onClick={closeWindow}>Закрыть задачу</Button>{''} 
                <Button variant="outline-danger" id={props.task}  onClick={deleteTask}>Удалить задачу</Button>{''} 
           </div>
           
        </div>
    )
}) 



export default AppearWindow