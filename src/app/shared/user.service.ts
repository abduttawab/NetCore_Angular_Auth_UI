import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb:FormBuilder, private http:HttpClient) { }

  readonly BaseURI = 'http://localhost:64936/api/';

  formModel = this.fb.group({
    UserName:['',Validators.required],
    Email:['',Validators.email],
    FullName:[''],
    Passwords:this.fb.group({
      Password:['',[Validators.required,Validators.minLength(4)]],
      ConfirmPassword:['',Validators.required]
    },{validator:this.comparePasswords})
  });

  comparePasswords(fb:FormGroup){
    let confirmPassCtr = fb.get('ConfirmPassword');
debugger;
    if(confirmPassCtr.errors == null || 'passwordMismatch' in confirmPassCtr.errors){
      if(fb.get('Password').value != confirmPassCtr.value)
        confirmPassCtr.setErrors({passwordMismatch:true});
      else
        confirmPassCtr.setErrors(null);
    }

  }


  register()
  
  {
    var body = {
      UserName : this.formModel.value.UserName,
      Email : this.formModel.value.Email,
      Password : this.formModel.value.Passwords.Password,
      FullName : this.formModel.value.FullName
    } ;

    return this.http.post(this.BaseURI+'ApplicationUser/Register',body);
  }


login(formData){

  return this.http.post(this.BaseURI+'ApplicationUser/Login',formData);
}

getUserProfile(){
  return this.http.get(this.BaseURI+'UserProfile');
}
roleMatch(allowedRoles): boolean {
  var isMatch = false;
  var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
  var userRole = payLoad.role;
  allowedRoles.forEach(element => {
    if (userRole == element) {
      isMatch = true;
      return false;
    }
  });
  return isMatch;
}
}
