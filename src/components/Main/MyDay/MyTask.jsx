import React from 'react';
import styles from '../../../styles/Main/main.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {  changeLine,  correctStyle, moveToActiveTasksAgain, moveToCompletedTask,setWindow } from '../../../reducers/plained-reducer';
import { useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import AppearWindow from '../Plained/AppearWindow.jsx';
import classNames from 'classnames';





const Task=React.memo((props)=>{ 
    let dispatch=useDispatch();
    let show=useSelector(store=>store.plainedReducer.setWindow)?.filter(item=>item?.task===props.task && item.page==='/myday')[0]; // показать расширенное окно задач
    let data=useSelector(store=>store.plainedReducer.date)?.filter(item=>item.task===props.task)[0]?.date?.split(',')[0];//дата,выбранная в календаре
    let dataFlag=useSelector(store=>store.plainedReducer.date)?.filter(item=>item.task===props.task)[0]?.task;//флаг для высвечивания иконки календаря
    let repeate=useSelector(store=>store.plainedReducer.repeate)?.filter(item=>item?.task===props.task)[0]?.task;// флаг для высвечивания иконки повтора
    let note=useSelector(store=>store.plainedReducer.hasNote)?.filter(item=>item?.task===props.task)[0]?.task;// флаг для высвечивания иконки заметок
    let correct=useSelector(store=>store.plainedReducer.correctStyle);// корректирует стилисткику сжатия главного окна при открытии настроек
    let task_label=classNames(styles.taskComponent,styles.task_label);//применение нескольких классов 

    let addTofinished=(nameComletedTask)=>{
        dispatch(moveToCompletedTask(nameComletedTask.name));
    }

    let addToUnfinished=(nameComletedTask)=>{
        dispatch(moveToActiveTasksAgain(nameComletedTask.name));
    }


    let checkedTask=()=>{
        let nameComletedTask=document.getElementsByName(props.task)[0];
        if(props.check){ // проверка на нажатие чекбокса
            addToUnfinished(nameComletedTask);
            dispatch(changeLine(false));
        }
        else{
            addTofinished(nameComletedTask);
            dispatch(changeLine(true));
        }
          
       
    }

    let appearSettings=(e)=>{//открыти окна настроек задачи по клику на нее
        dispatch(setWindow(e.currentTarget.id,true,'/myday'));
        dispatch(correctStyle(true));
        document.querySelector('.keepLeft').style.width="70%";
    };


    
  
    useEffect(()=>{
        if(!correct){
            document.querySelector('.keepLeft').style.width="100%"
            document.querySelector('#inputValue').style.width="95%";

        }else{
            document.querySelector('.keepLeft').style.width="64%"
            document.querySelector('#inputValue').style.width="60%";
        };
    });

    return(
        <div>
            {((props.flag==="#Сегодня" &&  data===new Date().toLocaleDateString()))  &&
                <div >
                    {/* <div className={styles.input}>
                        <InputGroup.Checkbox  aria-label="Checkbox for following text input" onChange={checkedTask} checked={props.check} name={props.task}/>
                        <div className={props.line ? styles.lineThrought : styles.mainComponent} onClick={appearSettings}  id={props.task} >
                            <div>{props.task}</div>
                            <div className={styles.icons}>
                                <img className={dataFlag===props.task ? styles.iconActive : styles.icon} id='calendar' src="https://cdn.icon-icons.com/icons2/620/PNG/512/calendar-with-a-clock-time-tools_icon-icons.com_56831.png" alt=""/>
                                <img className={repeate===props.task ? styles.iconActive : styles.icon} id='repeate' src="https://cdn.icon-icons.com/icons2/621/PNG/512/redo-circular-arrow_icon-icons.com_56886.png" alt="" />
                                <img className={note===props.task ? styles.iconActive : styles.icon} id='note' src="https://cdn.icon-icons.com/icons2/911/PNG/512/notes-edit-button_icon-icons.com_71407.png" alt="" />
                            </div>
                        </div>
                       
                    </div> */}
                    <div className={styles.task}>
                        <input type="checkbox" id="todo"  onChange={checkedTask} checked={props.check} name={props.task} className={styles.task_input}/>
                        <label className={task_label}  onClick={appearSettings} data-content={props.task}  id={props.task}>
                            <div >{props.task}</div>
                            {!(correct)  && 
                                <div className={styles.icons}>
                                    <img className={dataFlag===props.task ? styles.iconActive : styles.icon} id='calendar' src="https://cdn.icon-icons.com/icons2/620/PNG/512/calendar-with-a-clock-time-tools_icon-icons.com_56831.png" alt=""/>
                                    <img className={repeate===props.task ? styles.iconActive : styles.icon} id='repeate' src="https://cdn.icon-icons.com/icons2/620/PNG/512/calendar-with-a-clock-time-tools_icon-icons.com_56831.png" alt="" />
                                    <img className={note===props.task ? styles.iconActive : styles.icon} id='note' src="https://cdn.icon-icons.com/icons2/620/PNG/512/calendar-with-a-clock-time-tools_icon-icons.com_56831.png" alt="" />
                                </div> 
                            }
                            
                        </label>
                    </div>
                        
                    {(show?.set)  && 
                        <div >
                            <AppearWindow task={show.task} check={props.check} show={show} line={props.line} ></AppearWindow>
                        </div>
                    } 
                </div>
            }
        </div>

       
    )
})

export default Task