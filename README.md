

# ShareJourneys

**ShareJourneys** is a mobile application designed for users to share and manage their travel journeys. It features a React Native frontend and a Django backend, offering a seamless experience for journey management, user interactions, and notifications.

## Features

- **Journey Sharing:** Users can create, view, and share travel journeys.
- **User Authentication:** Secure login and registration with Django authentication and React Native forms.
- **Journey Management:** View details of journeys, including destinations, travel times, and activities.
- **Notifications:** Receive notifications about journey updates and reminders.
- **User Profiles:** Manage and view user profiles with journey history.

## Technologies Used

- **Frontend:** React Native
- **Backend:** Django
- **Authentication:** Django Rest Framework Oauth2
- **Notifications:** Django and React Native Push Notifications
- **Database:** MySQL

## Installation

### Backend (Django)

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/ShareJourneys.git
   cd ShareJourneys/backend
   ```

2. **Set Up a Virtual Environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure the Database:**
   - Update `backend/sharejourneys/settings.py` with your database configuration.
   - Run migrations:
     ```bash
     python manage.py migrate
     ```

5. **Start the Django Development Server:**
   ```bash
   python manage.py runserver
   ```

### Frontend (React Native)

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/ShareJourneys.git
   cd ShareJourneys/frontend
   ```

2. **Install Dependencies:**
   ```bash
   yarn install
   ```

3. **Start the React Native Development Server:**
   ```bash
   yarn start
   ```

4. **Run the App:**
   - For iOS:
     ```bash
     yarn ios
     ```
   - For Android:
     ```bash
     yarn android
     ```

## Usage

1. **User Registration and Login:** Register and log in to the application to start using features.
2. **Create and Share Journeys:** Use the app to create new journeys and share them with others.
3. **View and Manage Journeys:** Access your journey details and make updates as necessary.
4. **Receive Notifications:** Get notifications about journey updates and reminders.

## API Endpoints

- **POST /api/register:** Register a new user.
- **POST /api/login:** Log in to the application.
- **GET /api/journeys:** Retrieve all journeys.
- **POST /api/journeys:** Create a new journey.
- **GET /api/journeys/{id}:** Retrieve details of a specific journey.
- **PUT /api/journeys/{id}:** Update a specific journey.
- **DELETE /api/journeys/{id}:** Delete a specific journey.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. For any significant changes, please open an issue to discuss them first.

## Contact

For questions or feedback, contact us at: tuanchaunguyen13@.com

## License

This project is licensed under the [MIT License](LICENSE).
