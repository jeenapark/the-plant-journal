import { Navigate, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import './style/App.css';
import Login from './pages/Login';
import Garden from './pages/Garden';
import Signup from './pages/Signup';
import NavBar from './components/NavBar';

function App() {
    const { currentUser } = useContext(AuthContext)

    const RequireAuth = ({ children }) => {
        return currentUser ? children : <Navigate to="/login" />;
    };

    console.log(currentUser, "current user")

    return (
        <>
            <NavBar />
            <div className="bg-image">
                <div className='body'>
                    <Routes>
                        <Route path="/">
                            <Route path="login" element={<Login />} />
                            <Route path="signup" element={<Signup />} />
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
                </div>
            </div>
        </>
    );
}

export default App;
