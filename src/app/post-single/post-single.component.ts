import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location }                 from '@angular/common';
import { LoadPostsService } from '../services/load-posts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from '../_helpers/post';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-post-single',
  templateUrl: './post-single.component.html',
  styleUrls: ['./post-single.component.css']
})
export class PostSingleComponent implements OnInit {

  @Input() post: Post;
  currentUser: any = null;
  isAuthor: boolean;
  rForm: FormGroup;
  titleAlert: string = "This field is required";
  descriptionAlert: string = "You must provide a description between 30 and 500 symbols";
  model: any = {};

  editToggle: boolean = true;  //true for hide

  constructor(
    private loadPostService: LoadPostsService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private fb: FormBuilder,

  ) {
    this.rForm = fb.group({
      'title': [null, Validators.required],
      'description': [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)]) ]
    });
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.currentUser);

    this.route.paramMap
      .switchMap((params: ParamMap) => this.loadPostService.getById(+params.get('id')))
      .subscribe(post => {
        this.post = post;
        if (this.currentUser !== null) {
          this.currentUser.username == this.post.author_name ? this.isAuthor = true : this.isAuthor = false;
        } else {
          this.isAuthor = false;
        }
      });

      this.model.title = this.post.title;
      this.model.description = this.post.description;
      this.model.id = this.post.id;
      this.model.created_at = this.post.created_at;
      this.model.author_name = this.post.author_name;


  }

  updatePost() {
    this.loadPostService.update(this.model)
      .subscribe(
        data => {
          console.log('Post updates');
          this.router.navigate(['/posts']);
        },
        error => {
          console.log("ERROR " + error);
        });
  }

  toggleForm() {
    this.editToggle = !this.editToggle;
  }

  deletePost(post) {
    this.loadPostService.delete(post.id);
    this.router.navigate(['/posts']);
  }

}
