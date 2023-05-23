import { Navigate, Route, Routes } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { OrganismNameContext } from './context/OrganismNameContext';
import './style/App.css';
import Login from './pages/Login';
import Garden from './pages/Garden';
import Signup from './pages/Signup';
import NavBar from './components/NavBar';
import Entries from './pages/Entries';

function App() {
    const { currentUser } = useContext(AuthContext);
    const [showOrganismName, setShowOrganismName] = useState(JSON.parse(localStorage.getItem('show-plantname')) || "");

    const RequireAuth = ({ children }) => {
        return currentUser ? children : <Navigate to="/login" />;
    };

    return (
        <>
            <OrganismNameContext.Provider value={[showOrganismName, setShowOrganismName]}>
                {/* <NavBar showOrganismName={showOrganismName} /> */}
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
                                            {/* <Garden setShowOrganismName={setShowOrganismName} /> */}
                                            <Garden />
                                        </RequireAuth>
                                    }
                                />
                                <Route path="/entries/:organismId"
                                    element={
                                        <RequireAuth>
                                            <Entries />
                                        </RequireAuth>
                                    }
                                />
                            </Route>
                        </Routes>
                    </div>
                </div>
            </OrganismNameContext.Provider>
        </>
    );
}

export default App;
