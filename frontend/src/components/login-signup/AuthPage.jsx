import { useState, useEffect } from "react";
import AuthForm from "./AuthForm";

const AuthPage = ({ initialMethod }) => {
    const [method, setMethod] = useState(initialMethod);


    useEffect(() => {
        setMethod(initialMethod);
    }, [initialMethod]);

    // const route = method === 'login' ? '/api/token/' : '/api/user/register/';

    return (
        <div>
            <AuthForm method={method}>Hello</AuthForm> 
            {/* //route={route} */}
        </div>
    );
};

export default AuthPage;