import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-aub-bank',
  templateUrl: './aub-bank.component.html',
  styleUrls: ['./aub-bank.component.css']
})
export class AUBBankComponent implements OnInit{
  ngOnInit(): void {
   this.initLoginForm()
  }
  constructor(private fb:FormBuilder){}
  loginForm!:FormGroup;

  initLoginForm(){
    this.loginForm = this.fb.group({
      userName:['',Validators.required],
      password:['',Validators.required],
    })
  }


}
