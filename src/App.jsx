import { Route, Routes, useNavigate } from "react-router-dom"
import './App.css';
import MyDay from './components/Main/MyDay/MyDay'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Default from './components/Main/DefaultView/DefaultView'
import NavBar from './components/Navigation/Nav.jsx';
import Plained from "./components/Main/Plained/Plained";
import Routing from "./components/HOC/Routing";
import Start from "./components/Main/DefaultView/StartView";


function App(props) {
//доп листы
let navigate=useNavigate();
document.addEventListener('keydown',(e)=>{
  let a=false;
  if(e.keyCode === 27){
      navigate('/default')
  } 
}) 

  return (
    <>
     <header>
      <Navbar bg="black" variant="dark">
          <Container>
            <Navbar.Brand href="/">MYTODO</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text >
                Created by : <a className="mylink"href="https://vk.com/vegetableeeeeeee">Timur Tilyaev</a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <div className="App-content">
        <div><NavBar></NavBar></div>
        <div className="rightSideContent"> 
          <Routes>
            <Route exact path='/' element={<Start></Start>}></Route>
            <Route exact path='/default' element={<Default></Default>}></Route>
            <Route exact path='/myday' element={<MyDay></MyDay>}></Route>
            <Route exact path='/plained' element={<Plained store={props.store}></Plained>}></Route>
          </Routes>
          <Routing></Routing>
        </div>
       
      </div>
    </>
  );
}

export default App;
