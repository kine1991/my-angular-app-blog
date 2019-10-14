import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

  form: FormGroup

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required),
    })
  }

  submit(){
    if(this.form.invalid) return 
    const {title, author, text} = this.form.value
    const post: Post = {
      title, 
      author, 
      text,
      date: new Date()
    }
    console.log(post)

  }

}
