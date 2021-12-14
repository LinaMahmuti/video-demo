import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VideoStreamComponent } from './video-stream/video-stream.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    VideoStreamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyD_Z_m6xROly8OmMAAs50TyfIg0OS8FdRk",
      authDomain: "video-demo-8dabd.firebaseapp.com",
      projectId: "video-demo-8dabd",
      storageBucket: "video-demo-8dabd.appspot.com",
      messagingSenderId: "847826191536",
      appId: "1:847826191536:web:a070aab912eea3552da775"
    }),
    MatCardModule,
    MatButtonModule
  ],
  providers: [
    AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
