import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PlantDataModel } from '../data.model';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
import { displayDate } from '../date.model';

@Component({
  selector: 'app-dashboard-table',
  templateUrl: './dashboard-table.component.html',
  styleUrls: ['./dashboard-table.component.css']
})
export class DashboardTableComponent implements OnInit, OnChanges {

  @Input() baseUrl:string;
  @Input() aspectUrl:string;
  @Input() selectedValue:string;
  @Input() processValuekey:string;
  @Input() showCalculatedValues:boolean;
  @Input() showTotal:boolean;
  @Input() currentFromDate:string;
  @Input() currentToDate:string;

  iotAggUrl:string = "api/iottsaggregates/v3/aggregates/";
  timeInterval:string = "&intervalValue=1&intervalUnit=hour";
  selectedTableDate:string;
  currentDate:Date;
  nextDayDate:String;

  tableDate:displayDate[] = [];
  tableData:PlantDataModel[]=[];

  dayMax:number;
  dayMin:number;
  dayTotal:number;
  dayAverage:number;

  public myDatePickerOptions: INgxMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
  };
  
  constructor(private httpClient : HttpClient) { }

  ngOnInit() { }

  ngOnChanges(){
    this.currentDate = new Date();
    this.selectedTableDate = "";
    //this.selectedTableDate = this.currentDate.toDateString();
    this.dayMax = 0; this.dayMin =0; this.dayAverage=0; this.dayTotal=0;
    this.getData(this.currentFromDate,this.currentToDate,this.selectedValue);
  }

  filterOnDateForTable(){
    let reqParam:string;
    let tempDate= [];
    if(this.selectedTableDate===null || this.selectedTableDate===undefined){
     // TODO : if null what to do ??? reqParam=this.stringDate;
    }else{
      reqParam=JSON.parse(JSON.stringify(this.selectedTableDate)).formatted.toString();
    }

    tempDate=reqParam.split("/");
    
    if(Number(tempDate[0])+1 < 10)
      this.nextDayDate = "0"+(Number(tempDate[0])+1).toString();
    else
      this.nextDayDate = (Number(tempDate[0])+1).toString();
    
  //  let fromDate = tempDate[2]+"-"+tempDate[1]+"-"+tempDate[0]+"T"+"00"+":"+"00"+":"+"00"+"."+"000"+"Z";
    
  let fromDate = tempDate[2]+"-"+tempDate[1]+"-"+tempDate[0];
  let toDate = tempDate[2]+"-"+tempDate[1]+"-"+this.nextDayDate+"T"+"00"+":"+"00"+":"+"00"+"."+"000"+"Z";
    console.log("BEFORE CALLING this.selectedValue-----------"+this.selectedValue);
    this.getData(fromDate,toDate,this.selectedValue);
    console.log("this.selectedValue-----------"+this.selectedValue);

    console.log("tempDate[]2"+ tempDate[2]);
    console.log("tempDate[]1"+ tempDate[1]);
    console.log("tempDate[]0"+ tempDate[0]);

   
  }

  getData(fromDate:string,toDate:String,value:string){
    this.tableData=[];
    // creating url for http get() call
    //const requestUrl=this.baseUrl+this.iotAggUrl+this.aspectUrl+"?from="+fromDate
    //+"&to="+toDate+this.timeInterval+"&select="+value;
    console.log("this.getData-----------"+this.selectedValue);

    const requestUrl="http://localhost:8080/showTurbiditybyNameAndDate?name=delhi&date="+fromDate;
     console.log(requestUrl);
    //api call to get end time and average value
    this.httpClient.get(requestUrl)
      .subscribe((data) => {    
        
        

      for(let i=0; i<2;i++){
          let tempData= new PlantDataModel();
         tempData.timeStamp = data[i]["timestamp"];
       //  tempData.Water_Turbidity = data[i]["turbidity"];
        if(this.selectedValue.match("Water_Temperature"))
        {

          tempData.avgValue = data[i]["temperature"];
          console.log("in for ----in table"+ tempData.avgValue);
        }
  else if(this.selectedValue.match("Water_Turbidity"))
{
  tempData.avgValue = data[i]["turbidity"];
  console.log("in for loop----in table in turbidity"+ tempData.avgValue);


}



       

         
         console.log("tempData.timeStamp ----in table"+tempData.timeStamp);
         
        
        this.tableData.push(tempData);  
}

      //  this.getTableDate();
        // this.getCalculatedValues();
      });
  }

  getTableDate(){
    this.tableDate = [];
    this.tableData.forEach(element => {
      let tempVarDate = new displayDate(); 
      //let tempVar = element.endTime.split("T");
    //  tempVarDate.splitDate = tempVar[0];
     // let tempTime = tempVar[1].split("Z");
     // tempVarDate.splitTime = tempTime[0];  
     
     console.log("tempVarDate"+tempVarDate.timestamp);
      this.tableDate.push(tempVarDate);
    });
  }

  getCalculatedValues(){
    // let tempValues = [];
    // let valueCount = 0;
    // this.tableData.forEach(element => {
    //   if(element.avgValue != Number(""))
    //     {
    //       element.avgValue = Number(element.avgValue.toFixed(2));
    //       tempValues.push(element.avgValue);
    //       valueCount++;
    //     }
    //   });
    
    //   if(valueCount!=0){
    //     this.dayMax =  (Math.max.apply(Math,tempValues));
    //   this.dayMax = Number(this.dayMax.toFixed(2));
    //   this.dayMin =  Math.min.apply(Math,tempValues);
    //   this.dayMin = Number(this.dayMin.toFixed(2));
    //   this.dayTotal = tempValues.reduce(this.getSum);
    //   this.dayTotal = Number(this.dayTotal.toFixed(2));
    //   this.dayAverage = this.dayTotal/valueCount;
    //   this.dayAverage = Number(this.dayAverage.toFixed(2));
    //   } else {
    //     this.dayMax = 0;
    //     this.dayMin = 0;
    //     this.dayAverage = 0;
    //     this.dayTotal = 0;
    //   }
    

  }

  getSum(total,num){
    return total+num;
  }

}
