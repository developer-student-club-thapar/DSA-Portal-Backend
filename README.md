## User Schema

| Field           | Type    | Required | Unique |
|-----------------|---------|----------|--------|
| _id             | Mongoose.ObjectId  | Yes      | Yes   |
| name            | String  | Yes      | No     |
| email           | String  | Yes      | Yes    |
| leetcodeUserName| String  | Yes      | Yes    |
| leetcodeCookies | String  | Yes      | No     |
| solvedProblems  | [String]| Yes      | No     |

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
| title         | String              | Yes      | No     |
| solvedBy      | [mongoose.ObjectId] | No       | No     |

Note: The solvedBy conatins array of User IDs who have solved that particular problem




Sure, here's the API documentation for the provided code:



Got it! Let's modify the API documentation to include the authentication feature using JWT with Bearer token.

Got it! Apologies for the oversight. Let's update the API documentation to include the correct format for the `solvedBy` field, which will contain only the `_id` of the user who solved each problem.

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
  "leetcodeUserName": "john123",
  "leetcodeCookies": "encrypted_leetcode_cookies"
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
  "leetcodeUserName": "john123",
  "leetcodeCookies": "encrypted_leetcode_cookies"
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
    "solvedBy": ["user_id1", "user_id2", "user_id3", ...]
  },
  {
    "titleSlug": "reverse-integer",
    "title": "Reverse Integer",
    "solvedBy": ["user_id1", "user_id2", "user_id4", ...]
  },
  // Other problems...
]
```

