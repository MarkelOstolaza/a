import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component'; // Cambiar a AppComponent

bootstrapApplication(AppComponent, appConfig) // Cambiar App por AppComponent
  .catch((err) => console.error(err));