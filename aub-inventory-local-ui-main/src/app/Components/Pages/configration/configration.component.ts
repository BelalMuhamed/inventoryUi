import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/Services/loader/loader.service';

@Component({
  selector: 'app-configration',
  templateUrl: './configration.component.html',
  styleUrls: ['./configration.component.css']
})
export class ConfigrationComponent implements OnInit{
  maxTemp:number = 250;
  minTemp:number = 150;
  configFrm!:FormGroup;
  constructor(private fb:FormBuilder,public loaderService:LoaderService) {

  }

  ngOnInit(): void {
    this.initForm();

  }

  initForm() {
    this.configFrm = this.fb.group({
      cardInput:['',Validators.required],
      cardExit:['',Validators.required],
      cardReject:['',Validators.required],
      ip:['',Validators.required],
      offsetX:['',Validators.required],
      offsetY:['',Validators.required],
      tip:['',Validators.required],
    })
  }

  //Getters
  get cardInput() { return this.configFrm.get('cardInput');}
  get cardExit() { return this.configFrm.get('cardExit');}
  get cardReject() { return this.configFrm.get('cardReject');}
  get ip() { return this.configFrm.get('ip');}
  get offsetX() { return this.configFrm.get('offsetX');}
  get offsetY() { return this.configFrm.get('offsetY');}
  get tip() { return this.configFrm.get('tip');}
}
