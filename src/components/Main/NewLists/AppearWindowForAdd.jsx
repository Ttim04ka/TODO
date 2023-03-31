import React from 'react';
import Button from 'react-bootstrap/Button';
import styles from '../../../styles/Main/main.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { changeTaskTextForAdd, hasNoteForAdd, moveIntoCompletedTasks, moveToActiveTasksAgainInAddingList, setWindowforAdd,deleteTaskFromAddingList, setDataForAdd, isCalendarForAdd, chooseRepeateForAdd } from '../../../reducers/nav-reducer';
import classNames from 'classnames';
import { correctStyle } from '../../../reducers/plained-reducer';
import { useNavigate } from 'react-router-dom';




const AppearWindowForAdd=React.memo((props)=>{
    const [value, onChange] = useState(new Date()); // изменяет дату в календаре
    let dispatch=useDispatch();
    let activeTasks=useSelector(store=>store.plainedReducer.tasks); //
    let note=useSelector(store=>store.navReducer.note)?.filter(item=>item?.task===props.task && item.list===props.list)[0]?.note //заметки
    let isCalendar=useSelector(store=>store.navReducer.isCalendarForAdd)?.filter(item=>item.task===props.task && item.list===props.list)[0]?.check; // проверка влючен ли календарь
    let data=useSelector(store=>store.navReducer.date)?.filter(item=>(item?.task===props.task && item.list===props.list))[0]?.date; // выбранная в календаре дата
    let [currentDataForAdd,setCurrentDataForAdd]=useState(data); // отпраляет корректную дату в redux
    let repeateDays=useSelector(store=>store.navReducer.repeateForAdd)?.filter(item=>(item?.task===props.task && item?.list===props.list))[0]?.days;//задачи для фильтрации повтора
    let textarea_text_style=classNames(props.lineAdd  ? styles.line: styles.appear_input_block_input);//применение нескольких классов к textarea
    
    let options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timezone: 'UTC'
    }; // изменяет дату в нужный формат


    let check=true;
    let line=props.lineAdd;
    (function changeCheckedInput(){
        activeTasks.forEach((item,i)=>{
            if(item===props.task){
                check=false;
                line=false
                
            }
        })
    })() // корректный вывод активных и завершенных задач


    let deleteTaskForAdd=(e)=>{
        document.querySelector('.keepLeft').style.width="100%"
        document.querySelector('#inputValueNewList').style.width="95%"
        dispatch(setWindowforAdd(props.list,props.task,false));
        dispatch(deleteTaskFromAddingList(props.list,e.currentTarget.id));
        dispatch(correctStyle(false))
    };

    let changeTaskTextForAdding=(e)=>{
        dispatch(changeTaskTextForAdd(props.list,e.currentTarget.defaultValue,e.currentTarget.value));
        dispatch(setWindowforAdd(props.list,e.currentTarget.value,true));
    };

    let changeCheck=()=>{
        let nameComletedTask=document.getElementsByName(props.task)[0];
        if(props.check){
            dispatch(moveToActiveTasksAgainInAddingList(props.list,nameComletedTask.name));
        }
        else{
            dispatch(setWindowforAdd(props.list,nameComletedTask.name,false))
            dispatch(moveIntoCompletedTasks(props.list,nameComletedTask.name));
            dispatch(correctStyle(false))
        };
    };

    let closeWindowForAdd=()=>{
        document.querySelector('#inputValueNewList').style.width="95%"
        dispatch(setWindowforAdd(props.list,props.task,false));
        dispatch(correctStyle(false))
    };

    let addNoteForAdd=(e)=>{
        dispatch(hasNoteForAdd(props.list,props.task,e.currentTarget.value))
    };

    let setCalc=()=>{
        dispatch(isCalendarForAdd(props.list,props.task,true));
    };

    let getDataForAdd=(e)=>{
        setCurrentDataForAdd(e)
    };

    let hideCalendarForAdd=()=>{
        dispatch(isCalendarForAdd(props.list,props.task,false));
    };


    let saveDataForAdd=(e)=>{
        if(currentDataForAdd!==data){
            dispatch(setDataForAdd(props.list,props.task,`${currentDataForAdd.toLocaleString("ru", options)},${currentDataForAdd.toLocaleString("ru", {weekday:"long" })}`));
        };

        if(String(currentDataForAdd.toLocaleString("ru", options)).split(',')[0]!==new Date().toLocaleString("ru", options)){
            dispatch(setWindowforAdd(props.list,props.task,false));
        };
       
        dispatch(isCalendarForAdd(props.list,props.task,false))  ;
    };

    let chooseRepeated=(e)=>{
        if(e.currentTarget?.style.backgroundColor=='rgb(108, 117, 125)'){
            e.currentTarget.style.backgroundColor='white';
        }else{
  
            e.currentTarget.style.backgroundColor='#6c757d';
        };
    };

    let saveRepeated=()=>{
        let arr=[];
        document.querySelectorAll(`#B${props.task}Btn`).forEach(item=>{
            if(item.style.backgroundColor==='rgb(108, 117, 125)'){
                arr.push(item.name)
            }
        });
        dispatch(chooseRepeateForAdd(props.list,props.task,arr));
    };
    
    useEffect(()=>{
        document.querySelectorAll(`#B${props.task}Btn`).forEach(item=>{
            repeateDays?.forEach(elem=>{
                if(item.name===elem){
                    item.style.backgroundColor='#6c757d'
                }
            });
        });
    });  

    document.addEventListener('keydown',(e)=>{
        if(e.keyCode === 27){
           closeWindowForAdd();
        } 
    });//закрытие окна настроек по ESC

    return(

        <div className={styles.menu_settings}>
            <div className={styles.appear_input_block}> 
                <input type="checkbox"  onChange={changeCheck} checked={props.check} className={styles.appear_input_block_checkbox}  />
                <textarea type="text" data-content={props.task}  defaultValue={props.task} name={props.task.toString()}  onBlur={changeTaskTextForAdding} className={textarea_text_style} maxLength="70" rows="1"/>
            </div>
            <hr />
            {isCalendar ?  <div className={styles.calendar}><Calendar className={styles.open_calendar}  onChange={onChange} value={value} onClickDay={getDataForAdd} ></Calendar> <Button className={styles.calendar_btn} variant="outline-success" onClick={saveDataForAdd}>Сохранить</Button>{''} <Button variant="outline-danger" onClick={hideCalendarForAdd}>Закрыть выбор даты</Button>{''} </div> : <span className={styles.calendar} onClick={setCalc}>{(data==='' || data===undefined) ? "Выбрать дату" : data }</span>}
            <hr />
            <div >
                    <span className={styles.calendar}>Повтор</span>
                    <div className={styles.repeatData} >
                            <button className={styles.repeat_item} id={`B${props.task}Btn`} onClick={chooseRepeated} name='Monday'>пн</button>
                            <button className={styles.repeat_item} id={`B${props.task}Btn`} onClick={chooseRepeated} name='Tuesday'>вт</button>
                            <button className={styles.repeat_item} id={`B${props.task}Btn`} onClick={chooseRepeated} name='Wednesday'>ср</button>
                            <button className={styles.repeat_item} id={`B${props.task}Btn`} onClick={chooseRepeated} name='Thursday'>чт</button>
                            <button className={styles.repeat_item} id={`B${props.task}Btn`} onClick={chooseRepeated} name='Friday'>пт</button>
                            <button className={styles.repeat_item} id={`B${props.task}Btn`} onClick={chooseRepeated} name='Saturday'>сб</button>
                            <button className={styles.repeat_item} id={`B${props.task}Btn`} onClick={chooseRepeated} name='Sunday'>вс</button>
                    </div>

                    <Button variant="outline-secondary" id={props.task} className={styles.repeated_btn}  onClick={saveRepeated}>Сохранить</Button>{''} 
                </div>
            <hr />
            <div>
                    <textarea className={styles.note_textarea}  name="" id="" cols="47" rows="2" placeholder='Оставить заметку' defaultValue={note ?? ''} onBlur={addNoteForAdd} ></textarea>
            </div>
            <div className={styles.appear_btns}> 
                    <Button variant="outline-danger" id={props.task}  onClick={closeWindowForAdd}>Закрыть задачу</Button>{''} 
                    <Button variant="outline-danger" id={props.task}  onClick={deleteTaskForAdd}>Удалить задачу</Button>{''} 
            </div>
           
        </div>
    )
}) 



export default AppearWindowForAdd