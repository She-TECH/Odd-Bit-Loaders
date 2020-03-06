import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Chart } from "chart.js";
import { PlantDataModel } from '../data.model';
import { displayDate } from '../date.model';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker'; 
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-dashboard-graph',
  templateUrl: './dashboard-graph.component.html',
  styleUrls: ['./dashboard-graph.component.css']
})

export class DashboardGraphComponent implements OnInit,OnChanges {

  @Input() baseUrl:string;
  @Input() aspectUrl:string;
  @Input() processValuekey:string;
  @Input() selectedValue:string;
  @Input() currentFromDate: string;
  @Input() currentToDate: string;

  currentDate:Date;
  selectedGraphDate:string;

  chart :any;
  chartValues:PlantDataModel[] = [];
  chartArray =[];
  chartDate:displayDate[] = [];
  chartTimeArray = [];

  thresholdArray = [];
  thresholdValue:number;
  avergaeArray = [];
  averageValue:number;
  selectedPlant : string;
  nextDayDate:String;

  iotAggUrl:string = "api/iottsaggregates/v3/aggregates/";
  timeInterval:string = "&intervalValue=1&intervalUnit=hour";

  public myDatePickerOptions: INgxMyDpOptions  = {
    dateFormat: 'dd/mm/yyyy',
  };
  
  constructor(private httpClient : HttpClient,private route: ActivatedRoute) { 

    this.selectedPlant = route.snapshot.params['plantName'];
  }

  ngOnInit() { 
    this.selectedGraphDate = this.currentDate.toDateString();
  }

  ngOnChanges() {
    this.currentDate = new Date();
    this.selectedGraphDate = "";
    if(this.chart){
      this.chart.destroy();
    }
    this.chartValues=[];
    //this.selectedGraphDate = this.currentDate.toDateString();
    this.getData(this.currentFromDate,this.currentToDate,this.selectedValue);
  }

  filterOnDateForGraph(){
    let reqParam:string;
    let tempDate= [];
    if(this.selectedGraphDate===null || this.selectedGraphDate===undefined){
     // TODO : if null what to do ??? reqParam=this.stringDate;
    }else{
      reqParam=JSON.parse(JSON.stringify(this.selectedGraphDate)).formatted.toString();
    }

    tempDate=reqParam.split("/");
    
    if(Number(tempDate[0])+1 < 10)
      this.nextDayDate = "0"+(Number(tempDate[0])+1).toString();
    else
      this.nextDayDate = (Number(tempDate[0])+1).toString();
    
      let fromDate = tempDate[2]+"-"+tempDate[1]+"-"+tempDate[0];
    //let fromDate = tempDate[2]+"-"+tempDate[1]+"-"+tempDate[0]+"T"+"00"+":"+"00"+":"+"00"+"."+"000"+"Z";
    let toDate = tempDate[2]+"-"+tempDate[1]+"-"+this.nextDayDate+"T"+"00"+":"+"00"+":"+"00"+"."+"000"+"Z";
  
    this.getData(fromDate,toDate,this.selectedValue);
  }

  getData(fromDate:string,toDate:String,value:string){
    this.chartValues=[];
    // creating url for http get() call
  //  const requestUrl=this.baseUrl+this.iotAggUrl+this.aspectUrl+"?from="+fromDate
 //   +"&to="+toDate+this.timeInterval+"&select="+value;
 const requestUrl="http://ad001.siemens.net:8080/showTurbiditybyNameAndDate?name="+this.selectedPlant+"&date="+fromDate;

     console.log(requestUrl);
    //api call to get end time and average value
    this.httpClient.get(requestUrl)
      .subscribe((data) => {      
        
        for(let i=0;i<2;i++)
        {
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

  else if(this.selectedValue.match("Water_PH"))
{
  tempData.avgValue = data[i]["ph"];
  console.log("in for loop----in table in turbidity"+ tempData.avgValue);


}
else if(this.selectedValue.match("Water_TDS"))
{
  tempData.avgValue = data[i]["tds"];
  console.log("in for loop----in table in turbidity"+ tempData.avgValue);


}

this.chartValues.push(tempData);  

        }



        

      // for(let i=0; i<2;i++){
    //  let tempData= new PlantDataModel();
       //   tempData.endTime = data[i]["starttime"];
        //  tempData.avgValue = data[i][value] != undefined ? data[i][value]["average"] : "";
     //    this.chartValues.push(data[i]);  
   // }
      
       this.getTableDate();
      this.getCalculatedValues();
        this.showChart();
      });
  }

  getTableDate(){
    this.chartDate = [];
    this.chartValues.forEach(element => {
      let tempVarDate = new displayDate(); 
       tempVarDate.timestamp = element.timeStamp;
       console.log(" tempVarDate.timestamp ---------"+  tempVarDate.timestamp);

     // tempVarDate.splitDate = tempVar[0];
    ///  let tempTime = tempVar[1].split("Z");
      //tempVarDate.splitTime = tempTime[0];  
      this.chartDate.push( tempVarDate);
    });

    this.chartTimeArray = [];
    this.chartDate.forEach(element => {
      let tempVarDate = new displayDate(); 
      tempVarDate.timestamp = element.timestamp;
 //   this.chartTimeArray.push(element.splitTime);
     this.chartTimeArray.push(tempVarDate.timestamp );
    });
  }

  getCalculatedValues(){
    let tempValues = [];
    this.chartArray = [];
    let valueCount = 0;
    this.chartValues.forEach(element => {
      this.chartArray.push(element.avgValue);
      if(element.avgValue != Number(""))
        {
          tempValues.push(element.avgValue);
          valueCount++;
        }
      });
      if(valueCount == 0){
        this.chartArray = [];
        this.avergaeArray = [];
        this.thresholdArray = [];
      } else {
        let dayTotal = tempValues.reduce(this.getSum);
        this.averageValue = dayTotal/valueCount;
        console.log("graph value count : ",valueCount);
        console.log("graph sum,avg : ",dayTotal,this.averageValue);
        this.averageValue = Number(this.averageValue.toFixed(2));
        this.thresholdValue = this.averageValue*1.1;
        console.log("graph avg,threshold : ",this.averageValue,this.thresholdValue);
        this.avergaeArray = [];
        this.thresholdArray = [];
        for(let i=0; i<24; i++){
          this.avergaeArray.push(this.averageValue);
          this.thresholdArray.push(this.thresholdValue);
        }
      }
      
  }

  getSum(total,num){
    return total+num;
  }

  showChart(){
    if(this.chart){
      this.chart.destroy();
    }
      
    // chart object
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels : this.chartTimeArray,
        datasets: [
          { 
            label: 'Values',
            backgroundColor: '#4fabc9',
            data: this.chartArray,
            borderColor: '#4fabc9',
            fill: false
          },
          {
            label: 'Threshold Value',
            backgroundColor: '#ff4d4d',
            data: this.thresholdArray,
            borderColor: "#ff4d4d",
            fill:false
          },
          {
            label: 'Average Value',
            backgroundColor: '#808080',
            data: this.avergaeArray,
            borderColor: '#808080',
            fill:false
          }
        ]
      },
      options: {
        elements: {
          line: {
            tension: 0.01
          }
        }, 
        responsive: true,
        title:{
          display: true,
          text: 'Graph Plot'
        },
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
							display: true,
							labelString: 'Time'
						}
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
							display: true,
							labelString: 'Value'
						}
          }],
        }
      }
    });
  }

}
