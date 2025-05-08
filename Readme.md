# YouWay Platform

YouWay is a comprehensive mentoring and learning platform designed to connect students with mentors while providing administrators with management capabilities.

## Project Structure

This repository is organized into two main directories:

- `back-end/`: Contains the API and server-side logic
- `front-end/`: Contains the user interface components

## Features

### User Roles

YouWay supports three distinct user roles, each with customized interfaces and capabilities:

1. **Students**
   - Personalized dashboard with blue-themed interface
   - Access to learning materials and mentor sessions
   - Ability to schedule and manage sessions

2. **Mentors**
   - Specialized dashboard with green-themed interface
   - Tools for managing student sessions and progress
   - Communication features with students

3. **Administrators**
   - Complete administrative dashboard
   - User management capabilities
   - Session monitoring and management
   - Statistics and analytics

### Authentication System

- JWT-based authentication
- Role-based access control
- Secure password management

## Technology Stack

### Frontend
- React.js
- Axios for API communication
- JWT-Decode for token handling
- Pusher/Echo for real-time notifications

### Backend
- Laravel/PHP API
- Postgres database
- JWT authentication

## Development Setup

### Prerequisites
- Node.js and npm
- PHP and Composer
- Postgres
- docker