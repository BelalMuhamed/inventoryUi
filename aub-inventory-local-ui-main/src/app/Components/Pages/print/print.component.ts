import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit{
  name:string = '';
  printFrm!:FormGroup;
  constructor(private fb:FormBuilder) {}
  
  
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.printFrm = this.fb.group({
      name:['',Validators.required],
      product:['',Validators.required]
    })
  }

  
}
