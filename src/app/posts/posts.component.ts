import { Component, OnInit, Output } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthenticationService } from '../services/authentication.service';
import { LoadPostsService } from '../services/load-posts.service';
import { UserService } from '../services/user.service';

import { Post } from '../_helpers/post';
import { User } from '../_helpers/user';

@Component({
  selector: 'posts-list',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  currentUser: User;
  logged: boolean;
  users: User[] = [];
  posts: Post[] =[];
  postsPerPage: number = 5;
  postsForPage: Post[] = [];
  page: number;
  pages: number[] = [];
  selectedPost: Post;
  model: any = {};


  constructor(
    private loadPosts: LoadPostsService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    authenticationService.authenticated.subscribe((value) => {
      this.logged = value;
    });
  }

  login() {
    this.authenticationService.login(this.model.username, this.model.password)
    .subscribe();
  }

  // setPage(page, $event) {
  //   this.page = page;
  //   $event.target.classList.add('active');
  //   this.loadPosts.getPosts(this.page).then(posts => this.posts = posts);
  //   this.router.navigate(['/posts', this.page]);
  // }

  onSelect(post) {
    this.selectedPost = post;
    this.router.navigate(['/post', this.selectedPost.id]);
  }

  setPages() {
    let totalPages = Math.ceil(this.posts.length/ this.postsPerPage);
    for (let i = 1; i <= totalPages; i++) {
      this.pages.push(i);
    }
  }

  setPage(page) {
    this.postsForPage.length = 0;
    this.postsForPage = this.posts.slice(page * this.postsPerPage - this.postsPerPage, page * this.postsPerPage);
    console.log(this.postsForPage);
    console.log(page * this.postsPerPage - this.postsPerPage, page * this.postsPerPage);
  }

  private loadAllUsers() {
    this.userService.getAll().subscribe(users => { this.users = users; })
  }

  deleteUser(id: number) {
    this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
  }

  ngOnInit() {

    this.logged = (JSON.parse(localStorage.getItem('currentUser')) !== null) ? true : false;
    this.loadAllUsers();
    this.page = 1;
    this.loadPosts.getAll().subscribe(posts => { this.posts = posts.reverse()});
    //.router.navigate(['/posts', this.page]);
    this.setPages();
    this.setPage(1);
  }

}
