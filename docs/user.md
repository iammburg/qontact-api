# User API Spec

## Register User API

Endpoint: POST /api/users

Request Body:

```json
{
    "username": "ndaru",
    "password": "rahasia",
    "name": "iammburg"
}
```

Response Body Success:

```json
{
    "data": {
        "username": "ndaru",
        "name": "iammburg"
    }
}
```

Response Body Error:

```json
{
    "errors": "Username already registered"
}
```

## Login User API

Endpoint: POST /api/users/login

Request Body:

```json
{
    "username": "ndaru",
    "password": "rahasia"
}
```

Response Body Success:

```json
{
    "data": {
        "token": "unique-token"
    }
}
```

Response Body Error:

```json
{
    "errors": "Username or password wrong"
}
```

## Update User API

Endpoint: POST /api/users/current

Headers :

-   Authorization : token

Request Body:

```json
{
    "name": "ndaru lagi", //optional
    "password": "rahasia lagi" //optional
}
```

Response Body Success:

```json
{
    "data": {
        "username": "iammburg",
        "name": "ndaru lagi"
    }
}
```

Response Body Error:

```json
{
    "errors": "Name length max 100"
}
```

## Get User API

Endpoint: GET /api/users/current

Headers :

-   Authorization : token

Response Body Success:

```json
{
    "data": {
        "username": "iammburg",
        "name": "ndaru"
    }
}
```

Response Body Error:

```json
{
    "errors": "Unauthorized"
}
```

## Logout User API

Endpoint : DELETE /api/users/logout

Headers :

-   Authorization : token

Response Body Success :

```json
{
    "data": "Logout successful"
}
```

Response Body Error :

```json
{
    "errors": "Unauthorized"
}
```
