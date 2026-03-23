import { bootstrapApplication } from '@angular/platform-browser';
import { DrawerBasicDemo } from './app/drawer-basic-demo';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

  export const appConfig: ApplicationConfig = {
      providers: [
      provideHttpClient(withFetch()),
      providePrimeNG({
          theme: { preset: Aura, options: { darkModeSelector: '.p-dark' } },
      }),
    ],
  };

    bootstrapApplication(DrawerBasicDemo, appConfig).catch((err) =>
    console.error(err)
);