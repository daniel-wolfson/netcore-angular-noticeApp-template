TODO List: Notice Board SPA Implementation
This plan is divided into logical phases, from backend setup to frontend implementation and the bonus features.

Phase 1: Planning & Setup (שלב 1: הכנה ותכנון)
Define the Data Model (מודל הנתונים):
Decide on the exact properties for each "Notice" (מודעה). A good starting point would be:
id: A unique identifier (e.g., an integer or a GUID).
title: The title of the notice (string).
content: The main text of the notice (string).
author: The name of the person who created it (string). This is crucial for the "edit/delete my own posts" feature.
createdAt: The date and time the notice was created (DateTime).

For the bonus:
location: An object containing latitude and longitude.
Define the REST API Endpoints (הגדרת נקודות קצה ב-API):
Plan the specific routes and HTTP methods you will use. Following REST conventions:

GET /api/notices - Get a list of all notices.
GET /api/notices/{id} - Get a single notice by its ID.
POST /api/notices - Create a new notice.
PUT /api/notices/{id} - Update an existing notice.
DELETE /api/notices/{id} - Delete a notice.

Setup Development Environment:

Backend:
Install the .NET SDK.
Choose an IDE like Visual Studio or VS Code with C# extensions.
Frontend:
Install Node.js and npm.
Install the Angular CLI globally: npm install -g @angular/cli.
Tools:
Install Git for version control.
Install Postman or use the VS Code "REST Client" extension to test your API independently of the frontend.
Phase 2: Backend Development - C# REST API
Create the Project:

Open your terminal and run dotnet new webapi -n NoticeBoard.Api.
This creates a new C# Web API project.

Create the Notice Model:
Create a new C# class Notice.cs that reflects the data model you defined in Phase 1.
Implement the Data Service (Logic for JSON file):
Create a JsonDataService.cs or a "Repository" class. This class will be responsible for all interactions with the notices.json file.
Suggestion: Create methods like:
Task<List<Notice>> ReadNoticesAsync(): Reads and deserializes the entire JSON file into a list of Notice objects.
Task WriteNoticesAsync(List<Notice> notices): Serializes a list of Notice objects and writes it back to the JSON file, overwriting it.
This service will be used by your controller to perform the actual CRUD operations on the file.
Build the API Controller (NoticesController.cs):

Create a new controller to handle the HTTP requests.
Implement an action method for each endpoint you defined:

Get(): Calls the data service to read all notices from the JSON file and returns them.

Post([FromBody] Notice newNotice):
Reads all current notices.
Assigns a new unique ID and a createdAt timestamp to newNotice.
Adds the new notice to the list.
Writes the updated list back to the JSON file.

Put(int id, [FromBody] Notice updatedNotice):
Reads all notices.
Finds the notice with the matching id.
Updates its properties.
Writes the updated list back to the file.

Delete(int id):
Reads all notices.
Removes the notice with the matching id.
Writes the updated list back to the file.

Enable CORS (Cross-Origin Resource Sharing):
This is critical! Your Angular app will run on a different port (e.g., 4200) than your API (e.g., 5001). The browser will block requests unless you allow it.
In your Program.cs (or Startup.cs in older .NET versions), add a CORS policy to allow requests from your Angular development server (http://localhost:4200).

Test Your API:
Run your API project.
Use Postman or a similar tool to send GET, POST, PUT, and DELETE requests to your endpoints.
Verify that the notices.json file is created and updated correctly. Do not start the frontend until your API is working reliably.

Phase 3: Frontend Development - Angular SPA (שלב 3: פיתוח צד-לקוח)
Create the Project:
Open your terminal and run ng new notice-board-client.
When prompted, add Angular routing. Choose CSS or SCSS for styling.
Component & Service Structure:
Generate Components: Use the Angular CLI to create your components.
ng generate component components/notice-list (To display all notices)
ng generate component components/notice-item (To display a single notice card)
ng generate component components/notice-form (A form for creating/editing notices)
ng generate component components/search-filter (For the search bar and filters)

Generate Service: Create a service to communicate with your API.
ng generate service services/notice
Implement the NoticeService:
Import HttpClientModule in your app.module.ts.
In notice.service.ts, inject the HttpClient.
Create methods that call your backend API endpoints:
getNotices(): Makes a GET request to /api/notices.
addNotice(notice: Notice): Makes a POST request.
updateNotice(id: number, notice: Notice): Makes a PUT request.
deleteNotice(id: number): Makes a DELETE request.

Build the User Interface:
notice-list.component.ts:
In ngOnInit, call noticeService.getNotices() to fetch all data and store it in an array.
Use *ngFor in the HTML template to loop over the array and render a <app-notice-item> for each notice.
notice-item.component.ts:

Use @Input() to receive the notice data from the list component.
Display the notice title and content.
Add "Edit" and "Delete" buttons.
Suggestion for "My Notices": Since there's no real login system, you can simulate it. Have a hardcoded currentUser = "MyName" in a service. When creating a notice, set the author field to this name. In this component, only show the Edit/Delete buttons if notice.author === currentUser.
notice-form.component.ts:

Use Angular's Reactive Forms to build a form for title, content, and author.
The form can be used for both creating and editing. You can use an @Input() to pass in an existing notice for editing, which will pre-fill the form.
On submit, call the appropriate addNotice or updateNotice method from your service.
Search & Filtering:
In search-filter.component.ts, create an input for text search and dropdowns for filtering (e.g., by author).
Use @Output() and EventEmitter to send the filter values to the parent notice-list component.

The notice-list component will then filter the main array of notices based on these values. A pipe (| filter:searchTerm) is also a great Angular-native way to do this.
Set Up Routing:
In app-routing.module.ts, define your routes. A simple setup would be:
{ path: '', component: NoticeListComponent }
You could have separate routes for new and edit/:id that show the form component, or you can manage the form visibility using a modal (like Trello).
Phase 4: Bonus Features (שלב 4: מימוש בונוסים)
Backend Update:
Add the location object (with latitude and longitude) to your Notice.cs model.
Ensure your POST and PUT endpoints can receive and save this location data.
Frontend - Google Maps Integration:
Get API Key: You'll need a Google Maps Platform API key with the "Maps JavaScript API" and "Geocoding API" enabled.
Install Package: Use the official @angular/google-maps package.
In the notice-form component:
Add a map component to the form.
Allow the user to click on the map to place a marker. Capture the latitude and longitude of that marker and save it in your form.
Alternatively: Add a search input that uses the Geocoding API to convert an address into coordinates.
In the notice-list component:
Add a "Filter by My Location" button.
On click, use the browser's Geolocation API to get the user's current position: navigator.geolocation.getCurrentPosition().
Once you have the user's coordinates, implement a client-side filter. Loop through all notices and calculate the distance between the user's location and the notice's location.
Only show notices that are within a certain radius (e.g., 10km). You will need a function to calculate the distance between two geographical points (the Haversine formula).