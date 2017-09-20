import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Post } from '../_helpers/post';

@Injectable()
export class LoadPostsService {

  constructor(private http: Http) { }

  getAll() {
    return this.http.get('/api/posts', this.jwt()).map((response: Response) => response.json());
  }

  getById(id: number) {
    return this.http.get('/api/posts/' + id, this.jwt()).map((response: Response) => response.json());
  }

  create(post: Post) {
    return this.http.post('/api/posts', post, this.jwt()).map((response: Response) => response.json());
  }

  update(post: Post) {
    return this.http.put('/api/posts/' + post.id, post, this.jwt()).map((response: Response) => response.json());
  }

  delete(id: number) {
    return this.http.delete('/api/posts/' + id, this.jwt()).map((response: Response) => response.json());
  }

  private jwt() {
    // create header with auth token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token});
      return new RequestOptions({ headers: headers});
    }
  }
}




























// import { Injectable } from '@angular/core';
//
// import { Post } from '../_helpers/post';
// import { POSTS } from '../_helpers/posts-list';
//
// @Injectable()
// export class LoadPostsService {
//   postsPerPage: number = 5;
//
//   getPosts(page?: number): Promise<Post[]> {
//     page = arguments[0];
//     if (!page) {
//       return Promise.resolve(POSTS);
//     } else {
//       let first = page * this.postsPerPage - this.postsPerPage;
//       let last = page * this.postsPerPage;
//
//         var postsList = [];
//         for (let i = first; i < last; i++ ) {
//           if (POSTS[i]) {
//             postsList.push(POSTS[i]);
//           }
//         };
//         console.log(postsList);
//         return Promise.resolve(postsList);
//       };
//     }
//
//   getPost(id: number): Promise<Object> {
//     return this.getPosts()
//       .then(posts => posts.find(post => post.id === id));
//   }
//
// }
