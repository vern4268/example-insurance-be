## Setup required

1. Postgres db setup. See [how-to-use-the-postgres-docker-official-image](https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/).
2. Copy and paste .env.example to .env and supply the env variables.

## Steps to run the project

Install the project:

```bash
npm install
# or
yarn
```

Then, run the development server:

```bash
npm run start:dev
# or
yarn start:dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Or build and serve:

```bash
npm run build
# or
yarn build
```

```bash
npm run start:prod
# or
yarn start:prod
```

## Swagger UI is supported

1. Append /swagger to the url to access the Swagger API documentation.
2. Login using the /auth/login API as either a user or admin by specifying the role in the body.
3. Copy the auth token generated and authorize with Swagger (click on the 'Authorize' button).
4. Call API.

## Assumptions

1. Product code is unique.
2. All endpoints (except for auth) require authentication to access.
3. Postgres is used as the database.

## Featues

1. Login as user or admin.
2. Query for a product with productCode and location. (user & admin)
3. Create a new product by providing productCode, location and price. (admin only)
4. Update a product. (admin only)
5. Delete a product. (admin only)

## Solutions

-   Role access is enforced using guards. The auth guard verifies the jwt token in the request header and checks for role. The auth guard is imported as a global guard in the main file. Only controllers/services decorated by the @Role decorator supplied with a role is guarded.
-   Validation is done in the DTO using class-validator.
-   TypeORM is used to connect to the Postgres database.
