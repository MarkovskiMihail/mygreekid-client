import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import CalendarPage from './components/calendarpage';
import RegisterScreen from './components/registerScreen';
import AdminPage from './components/adminpage'
import MyBookings from './components/myBookings'
import CreateSlotsPage from './components/createSlots';

const App = () => {

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<RegisterScreen />}
                />
                <Route
                path="/Login"
                element={<Login />}
            />
                <Route
                    path="/calendarpage"
                    element={<CalendarPage/>}
                    />
                <Route
                    path="/adminpage"
                    element={<AdminPage/>}
                    />
                <Route
                    path="/myBookings"
                    element={<MyBookings/>}
                    />
                <Route
                    path="/createSlots"
                    element={<CreateSlotsPage/>}
                    />
            </Routes>
        </Router>
    );
};

export default App;