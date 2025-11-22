# Task Tracker CLI Tool

## Introduction
Hi, I'm Subhadip! I built this Task Tracker CLI tool as a hands-on project from [Roadmap.sh](https://roadmap.sh).

This project demonstrates how to create a simple task tracker using Node.js. There are two versions of the tool: one using pure Node.js (no external libraries), and another using some external libraries.

You can check out the project details on the [Roadmap.sh project page](https://roadmap.sh/projects/task-tracker).

## Project Structure

This repository contains two folders, each with a different approach to building the Task Tracker CLI tool:

- **`Using-JS`**: A pure Node.js implementation with no external libraries.
- **`Using-libraries`**: A version that uses external libraries, such as `commander`, to enhance functionality.

## Getting Started

To run either version of the CLI tool, follow the instructions below:

### 1. Using JS (No External Libraries)

1. Navigate to the `Using-JS` directory:
   ```bash
   cd Using-JS
    ```
2. Link the package globally & give execute permission
    ```bash
    chmod +x task-cli.js
    npm link
    ```
3. Run the tool with the command
    ```bash
    habbyJS
    ```

### 2. Using External Libraries

1. Navigate to the `Using-libraries` directory:
    ```bash
    cd Using-libraries
    ```
2. Install the required dependencies
    ```bash
    npm install
    ```
3. Link the package globally & give executable permission
    ```bash
    chmod +x index.js
    npm link
    ```
4. Run the tool with the command
   ```bash
   habby
   ``` 

### Additional Notes

The Using-JS version is great for learning about how Node.js works without relying on any external dependencies.

The Using-libraries version offers more functionality and flexibility by leveraging well-known libraries like commander.

Feel free to explore and modify the code to suit your needs! 😊