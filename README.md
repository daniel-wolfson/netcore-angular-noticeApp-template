# Compie Task
# Angular + TypeScript + .NET Core

## location on github
https://github.com/daniel-wolfson/Compie,74.-angular-core-example.git

## About this Project

A sample project combining a variety of useful web development technologies 
originally shown to work together Angular.

## Solution "Compie" structure

- Frontend - Project "CompieClient" uses Angular 20, TypeScript, Bootstrap
- Backend - Project "CompieApi" uses Asp Net Core 8

## Backend

- CompieApi.sln is the entry point for "classic" editions of Visual Studio (Pro, Community, etc).
- CompieApi/CompieApi.csproj is a Web api (asp net core) project.

Warning! project is self web host contained service, 
and it starts as console application

## Frontend

- cd [RootDirectory]\CompieClient
- required once:
    - Windows install (Angular CLI requires a minimum nodejs version): 
    - https://nodejs.org/en/ => node-v24.6.0-x64.msi download => install
    - npm install -g npm
    - npm install -g @angular/cli@19.2.15 (LTS)
- ng serve --open
- client by default working on http://localhost:4200 (if port 4200 already in use, select the other free port)
- client working with web api started on http://localhost:5000

## Build and start NoticeApi (asp net web api)
    (build occured from visual studio 2022)
- build solution
- start api:
    - cd [RootDirectory]\NoticeApi\bin\Debug\netcoreapp8.0
    - CompieApi.exe
    - app starting on http://localhost:5000
