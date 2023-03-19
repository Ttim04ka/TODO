import React from 'react';
import styles from '../../../styles/Main/main.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {  changeLine, correctStyle, moveToActiveTasksAgain, moveToCompletedTask,setWindow } from '../../../reducers/plained-reducer';
import { useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import AppearWindow from './AppearWindow';
import classNames from 'classnames';



const Task=React.memo((props)=>{ 
    let dispatch=useDispatch();
    let show=useSelector(store=>store.plainedReducer.setWindow)?.filter(item=>item?.task===props.task && item.page==='/plained')[0]; // показать расширенное окно задач
    let data=useSelector(store=>store.plainedReducer.date)?.filter(item=>item.task===props.task)[0]?.date?.split(',')[0];//дата,выбранная в календаре
    let dataFlag=useSelector(store=>store.plainedReducer.date)?.filter(item=>item.task===props.task)[0]?.task;//флаг для высвечивания иконки календаря
    let repeate=useSelector(store=>store.plainedReducer.repeate)?.filter(item=>item?.task===props.task)[0]?.task;// флаг для высвечивания иконки повтора
    let note=useSelector(store=>store.plainedReducer.hasNote)?.filter(item=>item?.task===props.task)[0]?.task;//флаг для высвечивания иконки заметок
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
            dispatch(setWindow(props.task,false,'/plained'));
            dispatch(correctStyle(false));
        }
          
       
    }

    let appearSettings=(e)=>{//открыти окна настроек задачи по клику на нее
        dispatch(setWindow(e.currentTarget.id,true,'/plained'));
        dispatch(correctStyle(true));
        
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
            {((props.flag==="#Сегодня" &&  data===new Date().toLocaleDateString()) || props.flag==='' || props.flag===`deleted${props.task}` || (props.flag==="#Завтра" &&  data===new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()))  &&
                <div >
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