import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [ButtonComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  router = inject(Router);

  navigateToMessages() {
    this.router.navigate(['/messages']);
  }
  navigateToPartners() {
    this.router.navigate(['/partners']);
  }
  
}
