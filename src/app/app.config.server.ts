import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
// import { provideServerRouting } from '@angular/ssr'; // 👈 මේක අනිවාර්යයි අලුත් version වලට
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // provideServerRouting(serverRoutes) // 👈 Router configuration එක server එකට දීම
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);