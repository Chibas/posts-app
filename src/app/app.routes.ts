import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PostsComponent } from './posts/posts.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { PostSingleComponent } from './post-single/post-single.component';
import { CreatePostComponent } from './create-post/create-post.component';

export const router: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'posts', component: PostsComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'register', component: RegisterComponent },
  { path: 'post/:id', component: PostSingleComponent},
  //{ path: 'posts/:page', component: PostsComponent},
  { path: 'edit', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
