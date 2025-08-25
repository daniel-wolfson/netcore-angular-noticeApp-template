# Task for Compie company
# Angular + TypeScript + .NET Core

## location on GitHub
https://github.com/daniel-wolfson/netcore-angular-noticeApp-template.git

## About this Project

A sample project combining a variety of useful web development technologies 
Originally shown to work together with Angular.

## Solution "NoticeApp" structure

- Frontend - Project "NoticeClient" uses Angular 20, TypeScript
- Backend - Project "NoticeApi" uses ASP.NET Core 8

## Backend

- NoticeApi.sln is the entry point for "classic" editions of Visual Studio (Pro, Community, etc).
- NoticeApi/NoticeApi.csproj is a Web api (ASP.NET Core 8) project.
- Started on https://localhost:5001

Warning! The project is a self-hosted web hosting service. 
and it starts as a console application

### Build and start NoticeApi (net web api)
    (build occurred from Visual Studio 2022)
- build solution
- start api:
    - cd [RootDirectory]\NoticeAPI\bin\Debug\net8.0
    - NoticeAPI.exe
    - app starting on https//localhost:5001

## Frontend

- cd [RootDirectory]\NoticeClient
- required once:
    - Windows install (Angular CLI requires a minimum Node.js version): 
    - https://nodejs.org/en/ => node-v24.6.0-x64.msi download => install
    - npm install -g npm
    - npm install -g @angular/cli@20.2.0 (LTS)
- ng serve --open
- client by default working on http://localhost:4200 (if port 4200 is already in use, select the other free port)
- client working with web api started on https://localhost:5001

Warning! The project contains a temporary Google Maps API key that provides data from Google geocoding. 
It will be avoided after the task and test completion

## The End - Enjoy!
