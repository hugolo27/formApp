# Form Builder App

A simple form builder that lets you create custom forms with different field types and collect responses. Built with React, TypeScript, and Material UI.

## What it does

- Create forms with various field types (text, textarea, datetime, boolean, etc.)
- Customize fields with options like required/optional, min/max values, placeholders
- Submit responses to your forms
- View all submissions for each form
- Clean, responsive UI

## API Reference

### Forms

#### Create a new form

```
POST /forms
```

Example request:

```json
{
  "name": "Customer Feedback",
  "fields": {
    "field1": {
      "question": "How would you rate our service?",
      "type": "rating",
      "required": true,
      "min": 1,
      "max": 5
    },
    "field2": {
      "question": "What improvements would you suggest?",
      "type": "textarea",
      "required": false,
      "placeholder": "Enter your suggestions here..."
    }
  }
}
```

#### Get all forms

```
GET /forms
```

#### Get a specific form

```
GET /forms/{id}
```

### Form Submissions

#### Submit a form response

```
POST /source-records
```

Example request:

```json
{
  "formId": "c01bad13-4a7a-4923-a315-9541e2f2a95d",
  "answers": [
    {
      "fieldId": "field1",
      "value": "4"
    },
    {
      "fieldId": "field2",
      "value": "The service was great, but the website could be improved."
    }
  ]
}
```

#### Get all submissions for a form

```
GET /source-records/form/{formId}
```

## Field Types

The app supports these field types:

- **text** - Single line text input
- **textarea** - Multi-line text input
- **datetime** - Date and time picker
- **boolean** - Yes/No toggle
- **email** - Email input with validation
- **number** - Numeric input with min/max values
- **select** - Dropdown selection
- **radio** - Radio button group
- **rating** - Numeric rating with customizable range
- **file** - File upload

## Setup

### Requirements

- Node.js (v14+)
- npm or yarn

### Getting Started

1. Clone the repo
2. Install dependencies:
   ```
   npm install
   ```
3. Start the dev server:
   ```
   npm run dev
   ```

### Environment Variables

Create a `.env` file with:

```
VITE_APP_NAME=Form App
VITE_API_URL=http://localhost:8080
```

## License

MIT
