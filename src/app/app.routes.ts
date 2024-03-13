import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    //NAVBAR
    {path:'home',component:HomeComponent},
    {path:'news',component:NewsComponent},
    {path:'news/:title',component:NewsDetailComponent},


    //OTHERS
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent },
    

];
