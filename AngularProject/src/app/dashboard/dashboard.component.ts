import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from './ExcelService';
import { AllPlantData } from './plantData.model';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [NgbModal,ExcelService]
})


export class DashboardComponent implements OnInit {
  
  currentDate:Date;
  currentFromDate:string;
  currentToDate:string;
  lastDataCount:number;
  fromDate: string;
  toDate: string;
  rptData: string[][]; 
  stringDate :string;

  accessToken:string;
  
  lastSelectedValue = "Water_Temperature";
  selectedValueForGraph:string;
  avgValue:number;
  
  baseUrl = "https://ctblrdev-rochem-ctblrdev.eu1.mindsphere.io/";
  aspectUrl="fcb67991a9d54550b5c560ee0a25e24f/S71500";
  iotAggUrl:string = "api/iottsaggregates/v3/aggregates/";
  timeInterval:string = "&intervalValue=1&intervalUnit=hour";

  plantDataArray:AllPlantData[] = [];
  navPaneValues:number[]=[];
  navDataPoints:string[] = [
    'Water_Temperature',
    'Water_Turbidity',
    'Water_PH',
    'Water_TDS'
  ];
  tLimit:boolean[]=[];
  
  user : string;
  selectedPlant : string;
  processValuekey:string;
  abc= 'Water_Temperature';
  iskpiClicked= false;
  closeResult: string;

  showCalculatedValues = true;
  showTotal = true;
  processValueMap = { 
    "Water_Temperature": "Water Temperature",
    "Water_Turbidity": "Water Turbidity" ,
    "Water_PH":"Water PH ",
    "Water_TDS":"Water TDS "
  };
 


  constructor(private httpClient : HttpClient, private router: Router,
  private route: ActivatedRoute,private modalService: NgbModal, private cookieService:CookieService) {
    this.user= route.snapshot.params['user'];
    this.selectedPlant = route.snapshot.params['plantName'];
    
  }
               
  public generateReport(reportFromDate: string, reportToDate: string){
    
    if(reportFromDate===null || reportFromDate===undefined){
      this.fromDate=this.stringDate;
    }else{
      this.fromDate = JSON.parse(JSON.stringify(reportFromDate)).formatted.toString()
    }
    if(reportToDate===null || reportToDate===undefined){
      this.toDate=this.stringDate;
    }else{
      this.toDate = JSON.parse(JSON.stringify(reportToDate)).formatted.toString()
    }

    let head = ['Date', 'Time',
      'Water Temperature',
      'Water Turbidity',
      'Water PH ',
      'Water TDS '
    ]
    
    this.rptData = [];

    let date1 = this.fromDate.split("/");
    let date2 = this.toDate.split("/");

    let nextDate2;
    let nextDate2ForMail;

    if(Number(date2[0])+1 < 10){
      nextDate2 = "0"+(Number(date2[0])+1).toString();
      nextDate2ForMail = "0"+(Number(date2[0])).toString();
    }
    else{
      nextDate2 = (Number(date2[0])).toString();
      nextDate2ForMail = (Number(date2[0])).toString();
    }

    let fromFormattedDate= date1[2]+"-"+date1[1]+"-"+date1[0]+"T"+"00"+":"+"00"+":"+"00"+"."+"000"+"Z";
    let toFormattedDate = date2[2]+"-"+date2[1]+"-"+nextDate2+"T"+"00"+":"+"00"+":"+"00"+"."+"000"+"Z";
    let toFormattedDateForMail = date2[2]+"-"+date2[1]+"-"+nextDate2ForMail;
    const requestUrl=this.baseUrl+this.iotAggUrl+this.aspectUrl+"?from="+fromFormattedDate
    +"&to="+toFormattedDate+this.timeInterval;

    this.httpClient.get(requestUrl).
    subscribe(data => {
      let len = JSON.parse(JSON.stringify(data)).length;
      
      for(let j=0;j<len;j++){
        let colIdx = 0;
        this.rptData[j] = [];
        let tempVar = data[j]["starttime"].split("T");
        let tempTime = tempVar[1].split("Z");
        this.rptData[j][colIdx++] = tempVar[0];
        this.rptData[j][colIdx++] = tempTime[0];
        
        let dataSetLength = Object.keys(data[j]).length;
        console.log("report array data length : ",dataSetLength );
        console.log("report array data : ",data[j] );
        if(dataSetLength<9){
          this.rptData[j][colIdx++] = "";
          this.rptData[j][colIdx++] = "";
          this.rptData[j][colIdx++] = "";
          this.rptData[j][colIdx++] = "";
         
          
        } else {
          this.rptData[j][colIdx++] = data[j][this.navDataPoints[0]]['average'].toFixed(2);
          this.rptData[j][colIdx++] = data[j][this.navDataPoints[1]]['average'].toFixed(2);
          this.rptData[j][colIdx++] = data[j][this.navDataPoints[2]]['average'].toFixed(2);
          this.rptData[j][colIdx++] = data[j][this.navDataPoints[3]]['average'].toFixed(2);
         

        }
        
      }

      new Angular2Csv(this.rptData, 'My Report', {headers: (head)});
    })

    let tempVarDate = fromFormattedDate.split('T');
    let tempFromDate = tempVarDate[0];
    tempVarDate = toFormattedDate.split('T');
    let tempToDate = tempVarDate[0];
    this.sendMail("Report was generated from "+tempFromDate+" to "+toFormattedDateForMail,"Report Generated");
  }

 sendMail(messageBody:string,subject:string){
    this.httpClient.get(this.baseUrl + 'notify/'+messageBody+'/'+subject)
    .subscribe(data => {
      console.log("email :",data);
    }, error => {
      console.log("email error :",error);
    })
  }
  
 /* Make KPI tab visible */
  
  /* Make Process value tab visible */
  addToProcessElement(){

    this.showCalculatedValues = true;
    this.abc= "Water_Temperature";
    this.processValuekey= this.processValueMap[this.abc];
    this.iskpiClicked = false;
    document.getElementById("processTab").className += " active ";
    document.getElementById("kpiTab").classList.remove("active");
  
    document.getElementById("processValues").classList.remove("fade");
    document.getElementById("processValues").className+= " active ";
    document.getElementById("kpis").classList.remove("active");
    document.getElementById("kpis").className+= " fade ";

    document.getElementById(this.lastSelectedValue).classList.remove("active");
    document.getElementById("Water_Temperature").className += " active ";
    this.lastSelectedValue = "Water_Temperature";
  }

  selectProcessDataPoint(dataPoint:string){  

    document.getElementById(this.lastSelectedValue).classList.remove("active");
    document.getElementById(dataPoint).className += " active ";
    this.lastSelectedValue = dataPoint;

    this.iskpiClicked = false
    this.abc= dataPoint;
    this.processValuekey= this.processValueMap[dataPoint];
    document.getElementById(dataPoint).className +=" active ";
    
    this.selectedValueForGraph=dataPoint;
    this.showCalculatedValues = true;
    if(dataPoint == "Total_Permeate" || dataPoint == "Total_Feed")
    {
      this.iskpiClicked = true
      this.showCalculatedValues = false;
    }
  }

  doLogout(){
    this.router.navigate(['/'])
  }

  goHomePage(){
    this.router.navigate(['/plantSelection', this.user])
  }
 
  ngOnInit() {
    
    this.lastDataCount = 0;
    this.currentDate=new Date();
    let day=this.currentDate.getDate().toString();
    let year=this.currentDate.getFullYear().toString();
    let month=(this.currentDate.getMonth()+1).toString();
    let nextDay = (Number(day)+1).toString();

    if(month.length<=1){
      month="0"+month;
    }
    if(day.length<=1){
      day="0"+day;
    }

    // fromDate and toDate are passed to child components also, so do not change in here
    let fromDate = year+"-"+month+"-"+day+"T"+"00"+":"+"00"+":"+"00"+"."+"000"+"Z";
    let toDate = year+"-"+month+"-"+nextDay+"T"+"00"+":"+"00"+":"+"00"+"."+"000"+"Z";
    this.currentFromDate = fromDate;
    this.currentToDate = toDate;
    
    this.getLatestData(day,month,year,nextDay);
    this.processValuekey = "Water Temperature ";   
  }

  getLatestData(day:any,month:any,year:any,nextDay:any){
    this.plantDataArray = [];
    let fromDate = year+"-"+month+"-"+day+"T"+"00"+":"+"00"+":"+"00"+"."+"000"+"Z";
    let toDate = year+"-"+month+"-"+nextDay+"T"+"00"+":"+"00"+":"+"00"+"."+"000"+"Z";
    this.getData(fromDate,toDate);
  }

  getData(fromDate:String,toDate:string){
    const requestUrl=this.baseUrl+this.iotAggUrl+this.aspectUrl+"?from="+fromDate
    +"&to="+toDate+this.timeInterval;

    this.plantDataArray = [];
    this.httpClient.get(requestUrl).subscribe(data =>{
      for(let i=0;i<24;i++){
        if(data[i]["Water Temperature"] != undefined){
          let tempData:AllPlantData = new AllPlantData();
          tempData.Water_Temperature = data[i]["Water_Temperature"]["average"];
          tempData.Water_Turbidity = data[i]["Water_Turbidity"]["average"];
          tempData.Water_PH = data[i]["Water_PH"]["average"];
          tempData.Water_TDS =  data[i]["Water_TDS"]["average"];
          this.plantDataArray.push(tempData);
        }
      }
      this.showLatestData();
    });
  }

  showLatestData(){
    if(this.plantDataArray.length!=0){
      let index = this.plantDataArray.length-1;
      this.navPaneValues = [];
      this.navPaneValues.push(this.plantDataArray[index].Water_Temperature);
      this.navPaneValues.push(this.plantDataArray[index].Water_Turbidity);
      this.navPaneValues.push(this.plantDataArray[index].Water_PH);
      this.navPaneValues.push(this.plantDataArray[index].Water_TDS);

     
      //to show threshold css
      let i = 0;
      this.tLimit=[];
      this.navDataPoints.forEach(value => {
        let tempValue:number[] = [];
       
        this.plantDataArray.forEach(element => {
          let tempVar = element[value];
          tempValue.push(tempVar);
        });
        
        let avgValue = tempValue.reduce(this.getSum);
        avgValue = avgValue/(this.plantDataArray.length);
        avgValue = Number(avgValue.toFixed(2));
        let thValue = avgValue*1.1;
        thValue = Number(thValue.toFixed(2));
        if(this.navPaneValues[i]>thValue){
          this.tLimit[i]=true;
          this.sendMail("Latest value of "+value+" : "+this.navPaneValues[i]+" exceeded the threshold value : "+thValue,"Threshold value exceeded for "+value);
        } else {
          this.tLimit[i]=false;
        }
        i++;
        
      });
    } else {
      // when there is no data on present date
      console.log("previous day values triggered !!!!");
      this.lastDataCount++;
      console.log("lastData count = ",this.lastDataCount);
      let day=this.currentDate.getDate().toString();
      let year=this.currentDate.getFullYear().toString();
      let month=(this.currentDate.getMonth()+1).toString();
      day = (Number(day)-this.lastDataCount).toString();
      let nextDay = (Number(day)+1).toString();

      if(month.length<=1){
        month="0"+month;
      }
      if(day.length<=1){
        day="0"+day;
      }

      let fromDate = year+"-"+month+"-"+day+"T"+"00"+":"+"00"+":"+"00"+"."+"000"+"Z";
      let toDate = year+"-"+month+"-"+nextDay+"T"+"00"+":"+"00"+":"+"00"+"."+"000"+"Z";
      console.log("previous day values : ", fromDate,toDate);
      this.getData(fromDate,toDate);
    }
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  
  getSum(total, num) {
    return total + num;
  }

  public myDatePickerOptions: INgxMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
  };

}