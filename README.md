
---

# ShareJourneys

**ShareJourneys** is a mobile application designed for users to share and manage their travel journeys. It features a React Native frontend and a Django backend, offering a seamless experience for journey management, user interactions, notifications, and real-time chat functionality using Firebase.

## Features

- **Journey Sharing:** Users can create, view, and share travel journeys.
- **User Authentication:** Secure login and registration with Django authentication and React Native forms.
- **Journey Management:** View details of journeys, including destinations, travel times, and activities.
- **Notifications:**Receive notifications when someone registers to join the ride-sharing.
- **User Profiles:** Manage and view user profiles with journey history.
- **Chat:** Real-time chat feature allowing users to communicate about their journeys using Firebase.

## Technologies Used

- **Frontend:** React Native
- **Backend:** Django
- **Authentication:** Django Rest Framework Oauth2
- **Notifications:** Django and Expo Push Notifications
- **Database:** MySQL
- **Real-time Chat:** Firebase Firestore

## Installation

### Backend (Django)

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Tuan2906/ShareJourneys.git
   cd ShareJourneysProject/backend
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

3. **Set Up Firebase:**
   - Install Firebase dependencies:
     ```bash
     yarn add @react-native-firebase/app @react-native-firebase/firestore
     ```
   - Configure Firebase:
     - Follow Firebase's setup guide to add Firebase to your React Native project.
     - Add your Firebase configuration to `frontend/src/firebaseConfig.js`.

4. **Start the React Native Development Server:**
   ```bash
   yarn start
   ```

5. **Run the App:**
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
5. **Chat with Users:** Use the chat feature to communicate with other users about journeys in real time.

## API Endpoints

- **POST /register:** Register a new user.
- **POST /login:** Log in to the application.
- **GET /journeys:** Retrieve all journeys.
- **POST /journeys:** Create a new journey.
- **GET /journeys/{id}:** Retrieve details of a specific journey.
- **PUT /journeys/{id}:** Update a specific journey.
- **DELETE /journeys/{id}:** Delete a specific journey.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. For any significant changes, please open an issue to discuss them first.

## Contact

For questions or feedback, contact us at: tuanchaunguyen13@gmail.com

## License

This project is licensed under the [MIT License](LICENSE).

---
