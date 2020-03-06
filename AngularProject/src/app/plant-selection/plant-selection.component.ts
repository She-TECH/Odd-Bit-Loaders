import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-plant-selection',
  templateUrl: './plant-selection.component.html',
  styleUrls: ['./plant-selection.component.css']
})

export class PlantSelectionComponent implements OnInit {

  regions: Array<string> = [ "Gurgaon" ];
  plants: Array<string> = ["-------Select Region-------"];
  user= null;
  selectedPlant : string;
  selectedRegion : string;

  constructor(private router: Router,private route: ActivatedRoute) {
    console.log("inside PlantSelectionComponent");
    this.user= route.snapshot.params['user'];
    console.log(this.user);
  }

  doLogout(){
    console.log("do Logout !!")
    this.router.navigate(['/'])
  }
  
  ngOnInit() {
  }
  
  onOkClick(){
    this.router.navigate(['/dashboard',this.user,this.selectedPlant]);
  }

  onRegionChange(){
    this.plants=["Sector 1", "Sector 2", "Sector 3", "Sector 4"];
  }
}
