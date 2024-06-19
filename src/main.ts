
import { bootstrapApplication,provideProtractorTestingSupport } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import routeConfig from './app/routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from "@angular/common/http";
import { enableProdMode, importProvidersFrom } from "@angular/core";


bootstrapApplication(AppComponent,
    {providers: [provideProtractorTestingSupport(),provideRouter(routeConfig), provideAnimationsAsync(),
                importProvidersFrom(HttpClientModule)
                ]
    })
  .catch(err => console.error(err));
