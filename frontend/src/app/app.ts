
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonButton } from '@ionic/angular';

@Component({
  imports: [IonButton, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
