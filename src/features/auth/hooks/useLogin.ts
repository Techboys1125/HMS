import {useState} from "react";
import {authService} from "../services/auth.service";
import {loginSchema} from "../validation/login.schema";
import type {LoginCredentials, LoginResponse}
from "../types/auth.types";

export function useLogin(onSuccess ?:(res: LoginResponse) => void) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState < string | null > (null);
    const [errors, setErrors] = useState < Record < string,
        string >> ({});

    const login = async (credentials : LoginCredentials,) : Promise < LoginResponse | null > => {
        const valErr = loginSchema(credentials);
        if (valErr) {
            setError(valErr);
            setErrors({form: valErr});
            return null;
        }

        setLoading(true);
        setError(null);
        setErrors({});

        try {
            const res = await authService.login(credentials);
            if (res && onSuccess) {
                onSuccess(res);
            }
            return res;
        } catch (err : any) {
            const msg = err.message || "Invalid email or password";
            setError(msg);
            setErrors({form: msg});
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        loading,
        error,
        errors,
        setError,
        setErrors
    };
}
