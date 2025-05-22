# GitHub Copilot Instructions

## Setup

To use GitHub Copilot in this project, follow these steps:

1. Install the GitHub Copilot extension for your code editor (e.g., Visual Studio Code).
2. Sign in to your GitHub account within the extension.
3. Enable GitHub Copilot for this repository.

## Usage

GitHub Copilot can assist you in writing code by providing suggestions and autocompletions. Here are some tips for using it effectively:

- Start typing a function or variable name, and GitHub Copilot will suggest completions.
- Use comments to describe the functionality you want to implement, and GitHub Copilot will generate code based on the description.
- Review and edit the suggestions provided by GitHub Copilot to ensure they meet your requirements.

## Best Practices

To get the most out of GitHub Copilot, consider the following best practices:

- Write clear and concise comments to guide GitHub Copilot in generating relevant code.
- Use GitHub Copilot as a tool to assist you, but always review and test the generated code.
- Combine GitHub Copilot suggestions with your own knowledge and expertise to create high-quality code.

## Examples

Here are some examples of how to use GitHub Copilot effectively in this project:

### Example 1: Generating a React Component

```jsx
// Create a new React component for a button
import React from 'react';

const MyButton = ({ label, onClick }) => {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
};

export default MyButton;
```

### Example 2: Writing a Supabase Query

```js
// Fetch all projects from the Supabase database
import { supabase } from '@/lib/supabase';

async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*');

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data;
}
```

### Example 3: Using Tailwind CSS for Styling

```jsx
// Create a styled card component using Tailwind CSS
import React from 'react';

const Card = ({ title, children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default Card;
```
