import { useState, useRef } from 'react'
import './App.css'

let names = [];
let money = [];
let whopays = [];

function CheckButtons({name, len, arr}){
  return (<div><input type="checkbox" onChange={(evnt)=> arr[len]===0?arr[len]=1:arr[len]=0}/>{name}</div>)
}
function RadioButtons({name, len, setter}){
  return <div><input type="radio" name="whopaid" onClick={(evnt)=>{setter(whopaid=>whopaid = len)}}/>{name}</div>
}

function Payments({name}){
  const payments = [];
  const id = names.findIndex(i => i.name === name)  

  let i = 0;
  names.forEach((person)=>{
    i++;
    if(name === person.name)
      return
    else
      payments.push(<div key={payments.length.toString()}>{person.name}: {money[id][i - 1]}</div>);
      
  });
  payments.push(<div key={payments.length.toString()}>Bilans: {money[id][id]}</div>)

  return(
    <div className='Payments'>
    <div>{name} płaci dla</div>
    {payments}
    </div>
  )
}


function ShopWindow(){
  const persons = [];
  const radio_buttons = [];
  const check_buttons = [];
  const new_person = useRef();
  const how_much = useRef();
  const [count,setCount] = useState(0);
  const [whopaid, setWhopaid] = useState(-1);

  names.forEach((pers) =>{
    persons.push(<Payments key={persons.length.toString()} name={pers.name}/>);
    radio_buttons.push(<RadioButtons key={radio_buttons.length.toString()} name={pers.name} len={radio_buttons.length} setter={setWhopaid}/> );
    check_buttons.push(<CheckButtons key={check_buttons.length.toString()} name={pers.name} len={check_buttons.length} arr={whopays}/>);
  });
  
 
  function add_person(evnt){
    if(evnt.key === "Enter"){
      whopays.push(0);
      console.log(whopays)
      names.push({name:new_person.current.value});
      new_person.current.value = ""
      setCount((count) => count += 1)
      let help = [0];
      money.map(x => {
        x.push(0)
        help.push(0)
      });
      money.push(help)
    }
  }

  function add_payments(evnt){
    if(evnt.key === "Enter"){
      if(whopaid===-1)
        return
      let price = how_much.current.value.replace(",", ".");
      let on = 0;
      whopays.forEach(per=>{
        if(per == 1)
          on++;
      });
      
      for(let i = 0; i < whopays.length; i++){
        if(i == whopaid)
          continue;
        if(whopays[i] == 1){
          money[i][whopaid] += (price/on);
          money[i][whopaid] = parseFloat(money[i][whopaid].toFixed(2));
          money[whopaid][whopaid] += (price/on)
          money[whopaid][whopaid] = parseFloat(money[whopaid][whopaid].toFixed(2));
          money[i][i] -= (price/on)
          money[i][i] = parseFloat(money[i][i].toFixed(2));
        
        }
      }
      
      
      how_much.current.value = "";
      setCount((count) => count+=1)
    
    }
  }

  function sort(evnt){
    for(let i = 0; i<names.length; ++i){
      for(let j = 0; j<names.length; ++j){
        if(i === j)
          continue
        if(money[i][j] !== 0 && money[j][i] !== 0)
          {
            money[i][j] -= money[j][i];
            money[j][i] = 0;
            if(money[i][j] < 0){
              money[j][i] = -money[i][j]
              money[i][j] = 0;
            }
          }
      }
    }
    setCount((count) => count+=1)
  }
  return (
    <div className='Add_win'>
      <input type="text" className='Add_person' ref = {new_person} onKeyDown={add_person}/>
      <div className='Window'>
        {persons}
      </div>
      <div className="Buttons">
        <div className='radioButtons'>
          <div>Kto płacił za zakupy</div>
            {radio_buttons}
          </div>
        <div className='checkButtons'>
          <div>Kogo zakupy</div>
          {check_buttons}
        </div>

        <div className="payButtons">
          Kwota
          <input type="text" onKeyDown={add_payments} ref={how_much}></input>
          <button onClick={sort}>Uprość</button>
        </div>
      </div>
    </div>
  )
}


function App() {

  return (
    <ShopWindow/>
  )
}


export default App