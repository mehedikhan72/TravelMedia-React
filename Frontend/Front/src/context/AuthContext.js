import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    let [user, setUser] = useState(() => localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)

    const navigate = useNavigate();

    const getUser = (pfpUrl) => {
        // console.log('fn called')
        if (localStorage.getItem('access_token')) {
            // console.log('if called')
            fetch(`https://travelmedia-api-production.up.railway.app/api/get_current_user/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.username) {
                        localStorage.setItem('user', JSON.stringify(data));
                        setUser(data);
                    }
                    else {
                        updateToken();
                    }
                })
        }

        //update pfp
        if (pfpUrl) {
            console.log(pfpUrl)
            fetch(`https://travelmedia-api-production.up.railway.app/api/add_social_image/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({
                    pfp: pfpUrl
                })
            })
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                })
        }
    }

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            getUser();
        }
    }, [localStorage.getItem('access_token')])

    const [message, setMessage] = useState(null);
    let loginUser = async (e) => {
        e.preventDefault();
        let response = await fetch(`https://travelmedia-api-production.up.railway.app/auth/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value,
                grant_type: 'password',
                client_id: 'f6WBSZSesx3EchqguKA0Mvfdz3PiQiZLSu5uMP39',
                client_secret: '78DqOuQLkIdfir2bj05KKYB8PPEq07G6CyVkcneVMtsaPA2xxn9n6q4iR40Y4gCSdG9MdtUl0QB8UyRjYaBAjHh1cRwEzkl2WSLsns2lOB2f1Yl1VIjiyH7F4iP506Cq'
            })
        })

        let data = await response.json();
        console.log(data);
        if (response.status === 200) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            navigate('/');
        }
        else {
            setMessage(data.error_description);
        }
    }

    let logoutUser = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
        console.log("logout")
    }

    let updateToken = async () => {
        console.log("update token called")
        let response = await fetch(`https://travelmedia-api-production.up.railway.app/auth/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refresh_token: localStorage.getItem('refresh_token'),
                grant_type: 'refresh_token',
                client_id: 'f6WBSZSesx3EchqguKA0Mvfdz3PiQiZLSu5uMP39',
                client_secret: '78DqOuQLkIdfir2bj05KKYB8PPEq07G6CyVkcneVMtsaPA2xxn9n6q4iR40Y4gCSdG9MdtUl0QB8UyRjYaBAjHh1cRwEzkl2WSLsns2lOB2f1Yl1VIjiyH7F4iP506Cq'
            })
        })
        let data = await response.json();

        if (response.status === 200) {
            console.log(data);

            const getUserPromise = new Promise((resolve, reject) => {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                resolve();
            });
            getUserPromise.then(() => {
                getUser();
            });
        }
        else {
            logoutUser();
        }

    }

    const socialLogin = (socialAccessToken, backend, pfpUrl) => {
        console.log("social login called");
        console.log(backend);
        if (socialAccessToken && backend) {
            fetch('https://travelmedia-api-production.up.railway.app/auth/convert-token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: socialAccessToken,
                    backend: backend,
                    grant_type: 'convert_token',
                    client_id: 'f6WBSZSesx3EchqguKA0Mvfdz3PiQiZLSu5uMP39',
                    client_secret: '78DqOuQLkIdfir2bj05KKYB8PPEq07G6CyVkcneVMtsaPA2xxn9n6q4iR40Y4gCSdG9MdtUl0QB8UyRjYaBAjHh1cRwEzkl2WSLsns2lOB2f1Yl1VIjiyH7F4iP506Cq'
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('refresh_token', data.refresh_token);
                    getUser(pfpUrl);
                    navigate('/');
                })
        }
    }

    useEffect(() => {
        let time = 1000 * 60 * 58;
        let interval = setInterval(() => {
            if (localStorage.getItem('refresh_token')) {
                updateToken();
            }
        }, time)
        return () => clearInterval(interval);
    },)


    let contextData = {
        user: user,
        loginUser: loginUser,
        logoutUser: logoutUser,
        socialLogin: socialLogin,
        message: message
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}