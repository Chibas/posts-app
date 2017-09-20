import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadPostsService } from '../services/load-posts.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  rForm: FormGroup;
  post: any;
  description: string = '';
  title: string ='';
  titleAlert: string = "This field is required";
  descriptionAlert: string = "You must provide a description between 30 and 500 symbols";
  model: any = {};

  constructor(
    private fb: FormBuilder,
    private loadPosts: LoadPostsService,
    private router: Router
  ) {
    this.rForm = fb.group({
      'title': [null, Validators.required],
      'description': [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)]) ]
    });
  }


  ngOnInit() { }

  addPost(post) {
    var d = new Date();

    this.model.author_name = this.currentUser.username;
    this.model.created_at = `${d.getDay()} / ${d.getMonth()} / ${d.getFullYear()}`;
    this.loadPosts.create(this.model)
      .subscribe(
        data => {
          console.log('Post created');
          this.router.navigate(['/posts']);
        },
        error => {
          console.log("ERROR " + error);
        });
  }

}
