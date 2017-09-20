import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {
  //array of users in LS
  let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
  let posts: any[] = JSON.parse(localStorage.getItem('posts')) || [];
  backend.connections.subscribe((connection: MockConnection) => {

      //authenticate
      if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
        let params = JSON.parse(connection.request.getBody());

        //find if user input matches users in storage
        let filteredUsers = users.filter(user => {
          return user.username === params.username && user.password === params.password;
        });

        if (filteredUsers.length) {
          //return 200 OK and fake token if user found
          let user = filteredUsers[0];
          connection.mockRespond(new Response(new ResponseOptions ({
            status: 200,
            body: {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              token: 'fake-jwt-token'
            }
          })));
        } else {
          connection.mockError(new Error('Uername or password is incorrect'));
        }
        return;
      }

      // get users
      if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Get) {

        //check for token
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: users})));
        } else {

          //no token or not valid
          connection.mockRespond(new Response(new ResponseOptions({status: 401})));
        }
        return;
      }

      //get user by id
      if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Get) {

        //check for token
         if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
           // find user by ID in users array
           let urlParts = connection.request.url.split('/');
           let id = parseInt(urlParts[urlParts.length - 1]);
           let matchedUsers = users.filter(user => { return user.id === id; });
           let user = matchedUsers.length ? matchedUsers[0] : null;

           //respond 200 OK
           connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: user })));
         } else {
           connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
         }

         return;
      }
      // create user
      if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Post) {
        //get new user from post body
        let newUser = JSON.parse(connection.request.getBody());

        //validation
        let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
        if (duplicateUser) {
          return connection.mockError(new Error('Username "' + newUser.username + '" is already taken'));
        }

        // save new user
        newUser.id = users.length + 1;
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        //respond 200 OK
        connection.mockRespond(new Response(new ResponseOptions({ status: 200})));

        return;
      }

      //delete user
      if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Delete) {
        // check for fake token and return user if true
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          //find user in users array
          let urlParts = connection.request.url.split('/');
          let id = parseInt(urlParts[urlParts.length - 1]);
          for (let i = 0; i < users.length; i++) {
            let user = users[i];
            if (user.id === id) {
              users.splice(i, 1);
              localStorage.setItem('users', JSON.stringify(users));
              break;
            }
          }

          //respond 200 OK
          connection.mockRespond(new Response(new ResponseOptions({ status: 200})));
        } else {
          // 401 if not authorized or missing token
          connection.mockRespond(new Response(new ResponseOptions({ status: 401})));
        }

        return;
      }

      // POSTS

            // get posts
      if (connection.request.url.endsWith('/api/posts') && connection.request.method === RequestMethod.Get) {
          connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: posts})));
        return;
      }

      //get post by id
      if (connection.request.url.match(/\/api\/posts\/\d+$/) && connection.request.method === RequestMethod.Get) {

        //check for token
           // find user by ID in users array
           let urlParts = connection.request.url.split('/');
           let id = parseInt(urlParts[urlParts.length - 1]);
           let matchedPosts = posts.filter(post => { return post.id === id; });
           let post = matchedPosts.length ? matchedPosts[0] : null;

           //respond 200 OK
           connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: post })));

         return;
      }

      //update post
      if (connection.request.url.match(/\/api\/posts\/\d+$/) && connection.request.method === RequestMethod.Put) {
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          console.log('FOUND1');
        //check for token
           // find post by ID in users array
           let urlParts = connection.request.url.split('/');
           let id = parseInt(urlParts[urlParts.length - 1]);
           let matchedPosts = posts.filter(post => { return post.id === id; });
           let post = matchedPosts.length ? matchedPosts[0] : null;

           let newPost = JSON.parse(connection.request.getBody());
           posts.map((post) => {
             if (post.id == newPost.id) {
               console.log('FOUND');
               for (let key in post) {
                 post[key] = newPost[key];
               };
             };
           });
           localStorage.setItem('posts', JSON.stringify(posts));
           //respond 200 OK
           connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: post })));
         } else {
           connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
         }

         return;
      }
      // create post
      if (connection.request.url.endsWith('/api/posts') && connection.request.method === RequestMethod.Post) {
        //get new user from post body
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          let newPost = JSON.parse(connection.request.getBody());

          //validation
          let duplicatePost = posts.filter(post => { return post.title === newPost.title; }).length;
          if (duplicatePost) {
            return connection.mockError(new Error('Post name "' + newPost.title + '" already exists'));
          }

          // save new user
          newPost.id = posts.length + 1;
          posts.push(newPost);
          localStorage.setItem('posts', JSON.stringify(posts));

          //respond 200 OK
          connection.mockRespond(new Response(new ResponseOptions({ status: 200})));
        } else {
          connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
        }
        return;
      }

      //delete post
      if (connection.request.url.match(/\/api\/posts\/\d+$/) && connection.request.method === RequestMethod.Delete) {
        // check for fake token and return user if true
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          //find user in users array
          let urlParts = connection.request.url.split('/');
          let id = parseInt(urlParts[urlParts.length - 1]);
          for (let i = 0; i < posts.length; i++) {
            let post = posts[i];
            if (post.id === id) {
              posts.splice(i, 1);
              localStorage.setItem('posts', JSON.stringify(posts));
              break;
            }
          }

          //respond 200 OK
          connection.mockRespond(new Response(new ResponseOptions({ status: 200})));
        } else {
          // 401 if not authorized or missing token
          connection.mockRespond(new Response(new ResponseOptions({ status: 401})));
        }

        return;
      }


      // REAL HTTP REQUESTS HANDLING
      let realHttp = new Http(realBackend, options);
      let requestOptions = new RequestOptions({
        method: connection.request.method,
        headers: connection.request.headers,
        body: connection.request.getBody(),
        url: connection.request.url,
        withCredentials: connection.request.withCredentials,
        responseType: connection.request.responseType
      });
      realHttp.request(connection.request.url, requestOptions)
        .subscribe((response: Response) => {
          connection.mockRespond(response);
        },
        (error: any) => {
          connection.mockError(error);
        });
      }, 500);


    return new Http(backend, options);
};

export let fakeBackendProvider = {
  // usage of fake backend
  provide: Http,
  useFactory: fakeBackendFactory,
  deps: [MockBackend, BaseRequestOptions, XHRBackend]
};


// POSTS
