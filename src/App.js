import { Navigate, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import './style/App.css';
import Login from './pages/Login';
import Garden from './pages/Garden';
import { AuthContext } from './context/AuthContext';

function App() {
    const { currentUser } = useContext(AuthContext)

    const RequireAuth = ({ children }) => {
        return currentUser ? children : <Navigate to="/login" />;
    };

    console.log(currentUser, "current user")

    return (
        <>
        <Routes>
            <Route path="/">
                <Route path="login" element={<Login />} />
                <Route
                index
                element={
                    <RequireAuth>
                        <Garden />
                    </RequireAuth>
                }
                />
            </Route>
        </Routes>
        </>
    );
}

export default App;
