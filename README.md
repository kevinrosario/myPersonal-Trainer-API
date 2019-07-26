# myPersonal Trainer

This is the back end of myPersonal Trainer application which is an application to keep track of users workout routines. It's designed to let users create workouts and edit them adding or removing exercises. Users can create and edit workouts only by logging in the application.

### User Stories
- As a unregistered user, I would like to sign up with email and password.
- As a registered user, I would like to sign in with email and password.
- As a signed in user, I would like to change password.
- As a signed in user, I would like to sign out.
- As a unregistered user, I would like to create a new workout.
- As a unregistered user, I would like to edit exercises added to the workout.
- As a signed in user, I would to add or remove exercises from a workout.
- As a signed in user, I would to remove created workouts.

### Technologies Used
- JavaScript
- React.js
- JSX
- MongoDB & Mongoose
- Node.js
- Express.js
- Handlebars
- Axios

### The Process

Due to the fact that I had four days to make this project, I decided to set-up the back-end with all the basic routes for both of my resources. This gave me more time to learn and experiment with React y greater depth than what I actually expected. After add the structure for the front-end and some basic functionality, I decided to go back to the back-end to make my own custom routes to meet my requirements. I spent the last hours before the presentation adding my own touch to the styling and making sure everything worked flawlessly.

### Routes

#### Authentication

  | Verb   | URI Pattern            | Controller#Action |
  |--------|------------------------|-------------------|
  | POST   | `/sign-up`             | `users#signup`    |
  | POST   | `/sign-in`             | `users#signin`    |
  | PATCH  | `/change-password/`    | `users#changepw`  |
  | DELETE | `/sign-out/`           | `users#signout`   |
  | PATCH  | `/follow/:_id`         | `users#follow`     |

#### Workout-template

  | Verb   | URI Pattern            | Controller#Action |
  |--------|------------------------|-------------------|
  | GET    | `/workout-template`    | `workout-template#index` |
  | GET    | `/workout-template/:id`| `workout-template#show`  |
  | PATCH  | `/workout-template/:id`| `workout-template#update`|
  | DELETE | `/workout-template/:id`| `workout-template#delete`|
  | POST   | `/workout-template`    | `workout-template#create`|


#### Exercises

  | Verb   | URI Pattern            | Controller#Action |
  |--------|------------------------|-------------------|
  | GET    | `/exercises`           | `exercises#index` |
  | GET    | `/exercises/:id`       | `exercises#show`  |
  | PATCH  | `/exercises/:id`       | `exercises#update`|
  | DELETE | `/exercises/:id`       | `exercises#delete`|
  | POST   | `/exercises`           | `exercises#create`|
  | POST   | `/multiple-exercises`  | `exercises#create`|

##### Stretch Goals:
1. Adding a 'Discover Workouts' route to show workouts created by other people.
2. Adding images and/or avatars.
3. Adding likes to other people workouts.
4. Adding the ability to clone another person workout.

##### Future Iterations
I want to add a timer that will help me rest between sets of every exercise in the workout.

##### Sites and Images:

[Front-End Repository](https://github.com/kevinrosario/myPersonal-Trainer-Client)

[Front-end app](https://kevinrosario.github.io/myPersonal-Trainer-Client/)

[Back-End Repository](https://github.com/kevinrosario/myPersonal-Trainer-API)

[Back-end app](https://mypersonal-trainer.herokuapp.com/)

[IRB](https://imgur.com/wDuDf0O)
