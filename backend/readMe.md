# Routes

- The base api Uri is "/api/v1"

## User Route

- the base User Uri is /users

- Registration for local entered email address is /

  - The body of the request should carry an object with email, password and/or name?.
  - The return response is an array of the default role of the current registered user.

- Login for the local entered email address is /auth

  - The body of the request should carry an object with email and password.
  - The return response is an array of the role of the current user.

- Selecting the Role of the user for that specific session route is /select-role

  - The body of the request should be an object the role e.g. {role : "Guest" }
  - The response for the selecting role route is the user object excluding the password

- Registration with google route is /auth/google

  - This redirects the user to a signin page with google

- The redirect link after the google authentication is /auth/google/callback
