# Pariwar-Link Backend API Documentation

This document provides an overview of the API endpoints available in the Pariwar-Link backend.

## Base URL

All API routes are prefixed with the base URL of your backend service.

## Authentication

*Authentication details will be added here when implemented.*

## API Endpoints

### Person Management

#### Create a New Person
- **Endpoint:** `POST /create`
- **Description:** Creates a new person record
- **Request Body:**
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "birthDate": "date",
    "deathDate": "date (optional)",
    "gender": "string (Male/Female/Other)",
    "photoUrl": "string (URL to photo)",
    "phoneNumber": "string (optional)",
    "socialLinks": {
      "facebook": "string (optional)",
      "instagram": "string (optional)"
    },
    "nickname": "string (optional)"
  }
  ```
- **Response:** Returns the created person object

#### Get All People
- **Endpoint:** `GET /get`
- **Description:** Retrieves a list of all people
- **Response:** Array of person objects

#### Get Person by ID
- **Endpoint:** `GET /get/:id`
- **Description:** Retrieves a specific person by their ID
- **Parameters:**
  - `id`: Person's unique identifier
- **Response:** Person object

#### Update Person
- **Endpoint:** `PUT /update/:id`
- **Description:** Updates an existing person's information
- **Parameters:**
  - `id`: Person's unique identifier
- **Request Body:** Same as create, but all fields are optional
- **Response:** Updated person object

#### Delete Person
- **Endpoint:** `DELETE /delete/:id`
- **Description:** Deletes a person and their relationships
- **Parameters:**
  - `id`: Person's unique identifier
- **Response:** Success message

### Family Relationships

#### Add Relationship
- **Endpoint:** `POST /add/:id/relations`
- **Description:** Creates a family relationship between two people
- **Parameters:**
  - `id`: ID of the primary person
- **Request Body:**
  ```json
  {
    "person": "string (person ID)",
    "relation_type": "string (father|mother|child|sibling|spouse|grandfather|grandmother|cousin)",
    "related_person": "string (related person's ID)"
  }
  ```
- **Response:** Created relationship object

#### Get Person's Relationships
- **Endpoint:** `GET /getRelations/:id/relations`
- **Description:** Retrieves all relationships for a specific person
- **Parameters:**
  - `id`: Person's unique identifier
- **Response:** Object with relationship types as keys and arrays of related people as values
  ```json
  {
    "father": [ { person object } ],
    "mother": [ { person object } ],
    "children": [ { person object }, ... ],
    "siblings": [ { person object }, ... ],
    "spouse": [ { person object } ]
  }
  ```

#### Remove Relationship
- **Endpoint:** `DELETE /remove/relations/:id`
- **Description:** Removes a specific relationship
- **Parameters:**
  - `id`: Relationship's unique identifier
- **Response:** Success message

## Error Responses

All error responses follow this format:
```json
{
  "error": "Error message describing the issue"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (invalid input)
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

*Rate limiting details will be added when implemented.*

## Versioning

This is version 1.0 of the API. Future versions will be documented separately.

## Support

For support, please contact the development team.
