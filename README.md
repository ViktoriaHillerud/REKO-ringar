# Introduction

REKO is an application for producers and consumers to sell and buy locally produced products and freshly produced raw food materials. Consumers can connect through the producers profile on the page, and also easily see when and where the producers will sell on a calendar. Producers are able to register an account to create own events to tell consumers where they will be for extradition, and also be able to edit their profile where they can post info about their business.

### Project Support Features
* Users can register and login to their accounts
* Public (non-authenticated) users can view the calendar and search and iew a specifik producers profile.
* Authenticated users can access all causes as well as create a new event, edit their created event and also delete the event.
Authenticated users can also edit their profile and remove their account.

### Installation Guide
* Clone this repository [here](https://github.com/ViktoriaHillerud/officialu09).
* There is only one branch, main.
* Run npm install to install all dependencies.
* You can either work with the default MongoDB Atlas database or use your locally installed MongoDB. Do configure to your choice in the application entry file.
* Create an .env file in your project root (server) folder and add your variables wich are:
- JWT_SECRET
- MONGO_DB_URI
- PORT

### Usage
* Run npm run dev to start the application.
* Connect to the API using Insomnia on port 4000.

### API Endpoints

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/events/users`                             | Retrieve all events that belongs to a user.                      |
| `GET`   | `/profile/{id}`                 | Get one registered user (protected route).                 |
| `GET`    | `/profile/public/{id}` | Get one public user (without sensitive data). |
| `POST`   | `/register`                             | Create a new user.                       |
| `POST`    | `/login`                          | Login user.                       |
| `POST` | `/createevent` | Create event.                    |
| `PUT`  | `/profile/edit`                          | Update registered user.                 |
| `PUT`    | `/events/update` | Update event. |
| `DELETE`    | `/events/delete` | Delete event. |
| `DELETE`    | `/profile/{id}` | Delete user. |

### Technologies Used
* [NodeJS](https://nodejs.org/) 
* [ExpressJS](https://www.expresjs.org/) 
* [MongoDB](https://www.mongodb.com/)
* [Mongoose ODM](https://mongoosejs.com/) 
* [React.js](https://react.dev/)
* [Full Calendar](https://fullcalendar.io/docs/react)

### Author
* [Viktoria Hillerud](https://github.com/ViktoriaHillerud)

### License
This project is available for use under the MIT License.