import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MdToolbarModule, MdButtonModule, MdInputModule, MdCardModule, MdButtonToggleModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//fake backend
import { fakeBackendProvider } from './_helpers/backend';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { routes } from './app.routes';
import { AuthGuard } from './auth.guard';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';

import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { LoadPostsService } from './services/load-posts.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { PostSingleComponent } from './post-single/post-single.component';
import { CreatePostComponent } from './create-post/create-post.component';

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    PostSingleComponent,
    CreatePostComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdToolbarModule,
    MdButtonModule,
    MdInputModule,
    MdCardModule,
    MdButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    routes,
    HttpModule
  ],
  providers: [
    LoadPostsService,
    AuthGuard,
    AuthenticationService,
    UserService,
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
