<div align="center">
  
 # [Welcome to Book Management Serve Application!- Book management Back!](https://github.com/Etubaba/scrapay-server) <img src="https://github.com/Etubaba/scrapay-server"  width="3%" height="3%">

</div>

<div align="center">
  
---

This project was deployed on [https://railway.app/](https://railway.app/) and can be accessed [here](https://scrapay-server.up.railway.app/).

---

</div>

### <span style="color:#297deb"> Project Status: </span><span style="color:#64fccc">Completed.</span>

## <span style="color:#297deb"> Project Description: </span>

This is a Graphql server built with nestJS, it authenticate users logged in via auth0 client interface. After a successful authentication user can now perform other book management operations using apollo client for client request.

Other tools includes express-jwt for authentication auth0 jwt token, prisma for database query, jwks-rsa to retrive secret for token validation.

Unit testing was implemented to run test for functionalities on this server.

# <span style="color:#297deb"> How to run: </span>

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# test a specific file
$ yarn test *test file name*

# test coverage
$ yarn test:cov
```
