## User Schema

| Field           | Type    | Required | Unique |
|-----------------|---------|----------|--------|
| _id             | Mongoose.ObjectId  | Yes      | Yes   |
| name            | String  | Yes      | No     |
| email           | String  | Yes      | Yes    |
| password           | String  | Yes      | No    |
| leetcodeUserName| String  | Yes      | Yes    |
| leetcodeCookies | String  | Yes      | Yes     |
| solvedProblems  | [String]| Yes      | No     |

Note: solvedProblems contains the title slug of the leetcode problem that the user has solved

### Instructions to find Leetcode Session Cookies:

- Open the browser and navigate to leetcode.com.
- Right click on the page and select “Inspect”
- In the developer tools, go to the Network tab and then choose XHR.
- Click on any link on the leetcode.com page.
- Select any of the http calls in the Network tab.
- Find the Cookie attribute in the Request Headers.

For more information on how the Leetcode scrapper works, visit this website: https://jacoblin.cool/LeetCode-Query/


## Problems Schema


| Field         | Type                | Required | Unique |
|---------------|---------------------|----------|--------|
| titleSlug     | String              | Yes      | Yes    |
| title         | String              | Yes      | Yes     |
| solvedBy      | [mongoose.ObjectID] | Yes       | No     |

Note: The solvedBy conatins array of User ID (_id) of those who have solved that particular problem


## API Documentation

### User Registration

#### Endpoint

```
POST /api/auth/register
```

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "123",
  "leetcodeUserName": "john123",
  "leetcodeCookies": "leetcode_session_cookies"
}
```

#### Response

- `201 Created`: User registration successful.

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "leetcodeUserName": "john123",
  "solvedProblems": []
}
```

### User Login

#### Endpoint

```
POST /api/auth/login
```

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "123"
}
```

#### Response

- `200 OK`: Login successful. Returns a JWT token.

```json
{
  "token": "your_generated_jwt_token_here"
}
```

### Get LeetCode Leaderboard

#### Endpoint

```
GET /api/user
```

#### Authentication and Authorization

This endpoint requires a valid JWT token. Pass the token as a Bearer token in the Authorization header.

```
Authorization: Bearer your_generated_jwt_token_here
```

#### Response

- `200 OK`: Successfully retrieved the leaderboard.

```json
[
  {
    "_id": "user_id1",
    "name": "John Doe",
    "leetcodeUserName": "john123",
    "solvedProblems": ["two-sum", "reverse-integer", "palindrome-number"]
  },
  {
    "_id": "user_id2",
    "name": "Alice Smith",
    "leetcodeUserName": "alice_smith",
    "solvedProblems": ["reverse-integer", "binary-search"]
  },
  // Other users...
]
```

### View Profile of a particular user (search by Leetcode username)

```
GET /api/user/:leetcodeUsername
```

#### Authentication and Authorization

This endpoint requires a valid JWT token. Pass the token as a Bearer token in the Authorization header.

```
Authorization: Bearer your_generated_jwt_token_here
```

#### Response

- `200 OK`: Successfully retrieved data of the user.

```json
{
  "name": "John Doe",
  "leetcodeUserName": "john123",
  "solvedProblems": ["two-sum", "reverse-integer", "palindrome-number"]
}
```

### Upate Leetcode Cookies of a particular user

#### Endpoint

```
PATCH /api/auth/update-cookies
```

#### Authentication and Authorization

This endpoint requires a valid JWT token. Pass the token as a Bearer token in the Authorization header.

```
Authorization: Bearer your_generated_jwt_token_here
```

#### Request Body

```json
{
  "leetcodeCookies": "new_leetcode_session_cookies"
}
```

#### Response 

- `200 OK`: Leetcode cookies update successful.

```json
{
  "message": "Leetcode cookies updated successfully."
}
```

### View All Problems and Users Who Solved Them

#### Endpoint

```
GET /api/problems
```

#### Authentication and Authorization

This endpoint requires a valid JWT token. Pass the token as a Bearer token in the Authorization header.

```
Authorization: Bearer your_generated_jwt_token_here
```

#### Response

- `200 OK`: Successfully retrieved all problems and users who solved them.

```json
[
  {
    "titleSlug": "two-sum",
    "title": "Two Sum",
    "solvedByUsers": [
      {
        "_id": "user_id1",
        "name": "John Doe",
        "leetcodeUserName": "john123"
      },
      {
        "_id": "user_id2",
        "name": "Alice Smith",
        "leetcodeUserName": "alice_smith"
      },
      {
        "_id": "user_id3",
        "name": "Bob Johnson",
        "leetcodeUserName": "bob_johnson"
      },
      // Other users who solved "Reverse Integer"...
    ]
  },
  {
    "titleSlug": "reverse-integer",
    "title": "Reverse Integer",
    "solvedByUsers": [
      {
        "_id": "user_id1",
        "name": "John Doe",
        "leetcodeUserName": "john123"
      },
      {
        "_id": "user_id2",
        "name": "Alice Smith",
        "leetcodeUserName": "alice_smith"
      },
      // Other users who solved "Two Sum"...
    ]
  },
  // Other problems...
]
```

