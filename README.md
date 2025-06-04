# Logic MCP Web Application

## Overview

This web application serves as a user interface for the [Logic MCP Server](https://github.com/Mnehmos/logic-mcp). It allows users to manage LLM (Large Language Model) configurations, view and explore logic chains and their operations, and interact with the server's capabilities in a more user-friendly way than direct API calls.

The application is built with HTML, CSS, and vanilla JavaScript, focusing on clarity and ease of use to demonstrate and control the backend server's functionalities.

## Features

-   **LLM Configuration Management**:
    -   View a list of all configured LLM providers (user-defined and the server's default).
    -   Add new LLM configurations by specifying a provider and model.
    -   Activate a specific LLM configuration for the server to use for its operations.
    -   Delete individual user-defined LLM configurations.
    -   Clear all user-defined LLM configurations.
    -   The server's default LLM profile is displayed as immutable but can be activated.
-   **Logic Chain Exploration**:
    -   View a list of all logic chains created on the server.
    -   Click on a chain to view its details and the sequence of operations within it.
    -   Operation details include primitive name, status, start/end times, input/output data, and context.
    -   "Copy to Clipboard" functionality for chain and operation details to aid in research and citation.
-   **Data Deletion**:
    -   Clear all logic chains and their associated operations from the server's database.

## Interacts With

-   **[Logic MCP Server](https://github.com/Mnehmos/logic-mcp)**: This web application communicates with the HTTP API exposed by the `logic-mcp` server (typically running on `http://localhost:3001`).

## Setup and Usage

1.  **Ensure the [Logic MCP Server](https://github.com/Mnehmos/logic-mcp) is running.** This webapp relies on the server's API.
2.  Clone this repository (or simply download the `html`, `css`, and `js` files).
3.  Open the `index.html` file in a modern web browser.

The web application will then connect to the locally running `logic-mcp` server API to fetch and display data.

## File Structure

-   `index.html`: The main HTML structure of the application.
-   `style.css`: Contains all the CSS rules for styling the application.
-   `script.js`: Handles all client-side logic, API interactions, and dynamic rendering of content.

## Development Notes

-   The application makes `fetch` requests to `http://localhost:3001` by default. If your `logic-mcp` server is running on a different port, you may need to adjust the URLs in `script.js`.
-   API key management for webapp-to-server communication is stubbed (`MCP_SERVER_API_KEY_FOR_WEBAPP` in `script.js`). For production, a secure method for managing this key would be required if API authentication is enabled on the server.

## Contributing

Contributions to improve the web application are welcome. Please feel free to submit pull requests or open issues.

---

*This web application provides a basic interface for the `logic-mcp` server. Enhancements and new features can be added as the server capabilities expand.*