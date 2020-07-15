import React from 'react';
import axios from 'axios';

import './App.css';

const SHEET_ID = '1UdAzp0Q7qMOIzcW-GHN1HOiIfgdlcIoLfS-VJPKUCZs';
const ACCESS_TOKEN = 'ya29.a0AfH6SMB9ti-vb1Jv7pMoU1J8nfIc78faLTt8XPmkeJh_2qUIj3OjVOWCNfOyidCIMArCyt7-kSCtwAyOdKUW5VHOIPwIFBu8l9B_1E8sDdlBq4_H77s8XPD6r3_AM0WHWzEHE8Membe3dkOfXgrmp2snkWbhPb_y27U';

class App extends React.Component {

  state = {
    sheets:[],
    data:[],
    formatedSheet:[],
    fetchingData:false,
    sheetSums:[]
  }
  isNumeric = (num) => {
    return !isNaN(num)
  }
  updateSheetValues = async () => {

    this.setState({fetchingData:true})
    const res = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?includeGridData=true`, {
      headers:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      }})

      console.log(res.data)

      this.setState({sheets:res.data.sheets})
      this.updateData();
      this.setState({fetchingData:false})
    }
  calculateSums = () => {
    let sheetSums = []
    let formatedSheet = this.state.formatedSheet
    formatedSheet.forEach( (sheet,shidx) => {
      let sum = Array(sheet.data[0].length).fill(0);
      for(var i = 1; i< sheet.data.length ; i++) 
      {
        var column = sheet.data[i];
        column.forEach( (data,index) => {
          if(this.isNumeric(data))
          {
            sum[index]+=+data
          }
        })
      }
      sheet.data.push(sum)
    })
    this.setState({sheetSums,formatedSheet})
  }
  updateData = () =>{
    let formatedSheet = []
    
    const sheets = this.state.sheets;
    sheets.forEach(sheet => {
      let data = []
      sheet.data[0].rowData.forEach( row => {
        let columnData = []
        row.values.forEach( column => {
          columnData.push(column.formattedValue)
        })
        data.push(columnData)
      })
      formatedSheet.push({data,sheetName:sheet.properties.title})
    });

    console.log(formatedSheet)
    this.setState({formatedSheet})
    this.calculateSums()
  }
    
  render() {
    return ( 
      <>
      <div className = "App" >
     
       {this.state.data}<br/>
        <button className="btn" onClick={this.updateSheetValues}>Get Sheets</button>
      </div>

      <div className = "container"> 
     
      <ul class="nav nav-pills">
       {this.state.formatedSheet.map( (sheet,index) => {
         return <li class={`${index==0?'active':" "}`}><a data-toggle="pill" href={`#${sheet.sheetName}`}>{`${sheet.sheetName}`}</a></li>
       })}
       </ul>
       
       <div class="tab-content">
         {this.state.formatedSheet.length == 0 ? <h5>Please Click on update to get the values</h5>:null }
         {this.state.fetchingData ? <h6>Loading ...</h6> : null}
       {this.state.formatedSheet.map( (sheet,index) => {
         
          return (
          <div id={sheet.sheetName} class={`tab-pane fade in ${index==0?'active':" "}`}>
          <h3>{sheet.sheetName}</h3>
          
          <table class="table table-striped table-hover .table-condensed  .table-responsive">
            {sheet.data.map( (data,index) => {
              
              if(index ==0)
              return (
                <>
                <thead>
                <tr>
                  {data.map( value => <th>{value}</th>)}
                </tr>
              </thead>
              </>
              )
              else
              return (
                <>
                <tbody>
                <tr>
              {data.map( value => { 
                 if(index == sheet.data.length-1 && value!=0) 
                  return <td>  SUM= { value==0?null:value}</td> 
                else
                 return  <td> { value==0?null:value}</td> 
                 } ) }
                </tr>
              </tbody>
              </>
              )
              
            })}
            
        </table>
        </div>)
        })}
       </div>
        
      </div>
      </>
    );

  }
}

export default App;