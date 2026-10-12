import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IonApp, IonContent, IonFooter, IonHeader, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar, IonIcon, IonBadge, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { basketOutline, homeOutline, leafOutline, cashOutline, searchOutline } from 'ionicons/icons';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    IonApp, IonContent, IonHeader, IonToolbar, IonTitle,
    IonFooter, IonTabBar, IonTabButton, IonTabs, IonIcon, IonBadge, IonLabel
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public cart: CartService) {
    addIcons({ basketOutline, homeOutline, leafOutline, cashOutline, searchOutline });
  }
}
