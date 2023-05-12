import './App.css';
import './Layout.css';

import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';

import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <div>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/*" element={<Layout />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
