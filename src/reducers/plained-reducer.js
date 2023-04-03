
let initialState={
  inputValue:'',//вписывание названия задачи в инпут
  hasNote:[{task:'',note:''}],//заметки
  tasks:[],//активные задачи
  completedTasks:[],//завершенные задачи
  setWindow:[{task:'',set:false,page:null}],//открытие-закрытие окна настроек задачи
  line:false,//перечеркнутая линия при завешении задачи
  isCalendar:false,//открыти-закрытие календаря
  date:[{task:'',date:''}],//дата выбранная в календаре
  repeate:[{task:'',days:[]}],//выбор дней для повтора задачи
  flagForSelectedDate:'',//флад для сортировке задач по конкретному промежуку времени
  correctStyle:false//изменяет стилистику при открытии окна настроек задачи
}
const plainedReducer=(state=initialState, action)=>{
    switch (action.type) {
      case 'CHANGE_VALUE':
        return {...state,inputValue:action.value};
      case 'CORRECT_STYLE':
        return {...state,correctStyle:action.bool};
      case 'CREATE_TASK':
        return {...state,tasks:[...state.tasks,action.task],inputValue:''};
      case 'DELETE_TASK':
        return {...state,tasks:state.tasks.filter(oldTask=>oldTask!==action.task),completedTasks:state.completedTasks.filter(oldTask=>oldTask.current!==action.task)};
      case 'CHANGE_VALUE_TASK':return changeTaskValue(state,action)
        
      case 'MOVE_TO_COMPLETED_TASK':

        state.tasks.forEach((item,i,arr)=>{
          if(item===action.name){
             state.completedTasks.push({current:arr[i],previous:arr[i-1]?arr[i-1]:null});
             arr.splice(i,1);
          };
        });

        return {...state,tasks:[...state.tasks],completedTasks:[...state.completedTasks]};
      case 'MOVE_TO_ACTIVE_TASK':return moveToActive(state,action)
        
      case 'SET_WINDOW': return setWindows(state,action)
          
      case 'CHANGE_LINE':
        return {...state,line:action.line};
      case 'HAS_NOTE':return setNote(state,action)
        
      case 'IS_CALCULATE':
        return {...state,isCalendar:action.bool};

      case 'CHOOSE_DATE':return setDate(state,action)
       
      case 'CHOOSE_REPEATE':return setRepeatedDays(state,action)
       
      case 'SET_FLAG':
        return {...state,flagForSelectedDate:action.str};

      default:
        return state
    }
}

let moveToActive=(state,action)=>{

  state.completedTasks.forEach((item,i,arr)=>{
    if(item.current===action.name){
      let move_to_active_flag;
      state.completedTasks.splice(i,1);
      
      state.tasks.some((element,index,mass)=>{

        if(element===item.previous){

          if(mass.length>1){
            let rest_arr=mass.splice(index+1)
            mass.push(action.name);
            mass.push(...rest_arr);
          }else{
            mass.push(action.name);
          }

          move_to_active_flag=true;
          return move_to_active_flag;
        }

        move_to_active_flag=false;
        return move_to_active_flag;
      });

      if(state.tasks.length===0){
        move_to_active_flag=false;
      };

      if(move_to_active_flag===false){
        state.tasks.unshift(action.name)    
      };
      
    };
  });
  return {...state,tasks:[...state.tasks],completedTasks:[...state.completedTasks]};
}

let setWindows=(state,action)=>{
  let flagForSetWindow=false

  state.setWindow.forEach(element=>{

    if(element.set===true){
      element.set=false
    }

    if(element.task===action.task){
      element.set=action.show;
      element.page=action.page;
      flagForSetWindow=true;
    }

  })

  if(!flagForSetWindow){
    state.setWindow.push({task:action.task,set:action.show,page:action.page})
  };

  return {...state,setWindow:[...state.setWindow]};
}
let setNote=(state,action)=>{
  let note_flag=false

  state.hasNote.forEach((item,i,arr)=>{
    if(item?.task===action.task){
      item.task=action.task
      item.note=action.note

      if(action.note===''){
        delete arr[i]
      }

      note_flag=true
    }

  })

  if(!note_flag){
    state.hasNote.push({task:action.task,note:action.note})
  }

  return {...state,hasNote:[...state.hasNote]};
}
let changeTaskValue=(state,action)=>{

  state.tasks.forEach((item,i,arr)=>{

    if(item===action.def){
      arr[i]=action.add;
    }

  })

  let changeValues=(arr)=>{
    arr.map(elem=>{
      elem.forEach((item,i,array)=>{
        if(item.task===action.def){
          array[i].task=action.add;
        }    
      })
    })
  }

  changeValues([state.date,state.hasNote,state.repeate])

  /* state.date.forEach((item,i,arr)=>{
    if(item.task===action.def){
      array[i].task=action.add;
    }    
  })

  state.hasNote.forEach((item,i,arr)=>{

    if(item.task===action.def){
      arr[i].task=action.add;
    }

  })

  state.repeate.forEach((item,i,arr)=>{
    if(item?.task===action.def){
      arr[i].task=action.add;
    }
  }) */

  return {...state,tasks:[...state.tasks],date:[...state.date],repeate:[...state.repeate],hasNote:[...state.hasNote]};
}
let setDate=(state,action)=>{
  let date_flag=false

  state.date.forEach(item=>{

    if(item.task===action.task){
      date_flag=true
      item.date=action.date;
    }

  })

  if(!date_flag){
    state.date.push({task:action.task,date:action.date})
  }

  return {...state,date:[...state.date]};
}


let setRepeatedDays=(state,action)=>{
  let repeated_flag=false

  state.repeate.forEach((item,i,arr)=>{
    if(item?.task===action.task){

      arr[i].days=action.days
      repeated_flag=true
      if(action.days.length===0) delete arr[i]

    }

  })
  
  if(!repeated_flag){
    state.repeate.push({task:action.task,days:action.days})
  }

  return {...state,repeate:[...state.repeate]};
}








export const changeValueCreator=(value)=>{
  return {
      type:'CHANGE_VALUE',value
  }
};
export const createTaskCreator=(task)=>{
  return {
      type:'CREATE_TASK',task
  }
};
export const deleteTaskCreator=(task)=>{
  return {
      type:'DELETE_TASK',task
  }
};
export const changeTaskTextCreator=(def,add)=>{
  return {
      type:'CHANGE_VALUE_TASK',def,add
  }
};
export const moveToCompletedTask=(name)=>{
  return {
      type:'MOVE_TO_COMPLETED_TASK',name
  }
};
export const moveToActiveTasksAgain=(name)=>{
  return {
      type:'MOVE_TO_ACTIVE_TASK',name
  }
};
export const setWindow=(task,show,page)=>{
  return {
      type:'SET_WINDOW',task,show,page
  }
};
export const changeLine=(line)=>{
  return {
      type:'CHANGE_LINE',line
  }
};
export const hasNote=(task,note)=>{
  return {
      type:'HAS_NOTE',task,note
  }
};
export const isCalculate=(bool)=>{
  return {
      type:'IS_CALCULATE',bool
  }
};
export const chooseDate=(task,date)=>{
  return {
      type:'CHOOSE_DATE',task,date
  }
};
export const chooseRepeate=(task,days)=>{
  return {
      type:'CHOOSE_REPEATE',task,days
  }
};
export const setFlagForSelectedDate=(str)=>{
  return {
      type:'SET_FLAG',str
  }
};
export const correctStyle=(bool)=>{
  return {
      type:'CORRECT_STYLE',bool
  }
};

export default plainedReducer