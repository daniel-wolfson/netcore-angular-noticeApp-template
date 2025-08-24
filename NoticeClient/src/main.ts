// import { platformBrowser } from '@angular/platform-browser';
// import { AppModule } from './app/app-module';

// platformBrowser().bootstrapModule(AppModule, {
//   ngZoneEventCoalescing: true,
// })
//   .catch(err => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppHomeComponent } from './app/components/app-home/app-home.component';

bootstrapApplication(AppHomeComponent, appConfig).catch((err) => console.error(err));
