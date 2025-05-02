import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { PartnersComponent } from './pages/partners/partners.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'partners', component: PartnersComponent },
];
