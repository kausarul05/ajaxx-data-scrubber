"use client";

import { useState, useEffect } from "react";
import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { apiRequest } from "@/app/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
    onClose: () => void;
    onSwitchToRegister: () => void;
    setActiveModal: (value: "login" | "register" | "forgotPassword") => void;
};

type LoginFormData = {
    email: string;
    password: string;
    rememberMe: boolean;
};

export default function LoginModal({ onClose, onSwitchToRegister, setActiveModal }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
        rememberMe: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    // Check for OAuth callback parameters
    useEffect(() => {
        const handleOAuthCallback = async () => {
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            const error = params.get('error');

            console.log("OAuth callback params:", { accessToken, error });

            // Handle OAuth error
            if (error) {
                setError(`Google authentication failed: ${error}`);
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
                return;
            }

            // Handle OAuth success
            if (accessToken) {
                setGoogleLoading(true);
                try {
                    console.log("Google access token received:", accessToken);

                    // Send the access token to your backend
                    const response = await apiRequest("POST", "/accounts/auth/google/", {
                        access_token: accessToken
                    });

                    console.log("Google login response:", response);

                    if (response.access || response.user) {
                        // Store token and user data
                        if (response.access) {
                            localStorage.setItem("authToken", response.access);
                        }

                        if (response.user) {
                            localStorage.setItem("userData", JSON.stringify(response.user));
                        }

                        setSuccess("Google login successful!");

                        // Redirect to dashboard after a brief delay
                        setTimeout(() => {
                            router.push('/dashboard');
                            onClose();
                        }, 1000);

                    } else {
                        setError(response.message || "Google login failed. Please try again.");
                    }
                } catch (err: any) {
                    console.log("Google login error:", err);
                    setError(err?.error || "Google authentication failed. Please try again.");
                } finally {
                    setGoogleLoading(false);
                    // Clean URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }
        };

        handleOAuthCallback();
    }, [router, onClose]);

    // Check for URL parameters (for popup method)
    useEffect(() => {
        const urlError = searchParams.get('error');
        const urlSuccess = searchParams.get('success');

        if (urlError) {
            setError(decodeURIComponent(urlError));
        }
        if (urlSuccess) {
            setSuccess(decodeURIComponent(urlSuccess));
        }
    }, [searchParams]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear errors when user starts typing
        if (error) setError("");
    };

    const handleOpenForgetPasswordModal = () => {
        setActiveModal("forgotPassword");
    };

    const handleLogin = async () => {
        // Basic validation
        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            // Prepare payload
            const payload = {
                email: formData.email,
                password: formData.password
            };

            console.log("Sending login request:", payload);

            // Call your API using the common apiRequest function
            const data = await apiRequest("POST", "/accounts/login/", payload);

            console.log("Login response:", data);

            // Handle successful login
            if (data.access || data.user) {
                console.log("Login successful", data);

                // Store token and user data
                if (data.access) {
                    localStorage.setItem("authToken", data.access);
                }

                if (data.user) {
                    localStorage.setItem("userData", JSON.stringify(data.user));
                }

                // Store remember me preference if needed
                if (formData.rememberMe) {
                    localStorage.setItem("rememberMe", "true");
                }

                setSuccess("Login successful!");

                // redirect to dashboard after a brief delay
                setTimeout(() => {
                    router.push('/dashboard');
                    onClose();
                }, 1000);

            } else {
                setError(data.message || "Login failed. Please check your credentials.");
            }
        } catch (err: any) {
            console.log("Login error:", err?.error);
            // Handle specific error messages from your API
            if (err) {
                setError(err?.error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Method 1: Google Identity Services (Popup) - Most User Friendly
    const handleGoogleLoginPopup = async () => {
        setGoogleLoading(true);
        setError("");
        setSuccess("");

        try {
            console.log("Starting Google login...");

            // Load Google Identity Services script if not already loaded
            await loadGoogleScript();

            console.log("Google script loaded");

            // Initialize and launch Google OAuth
            const authTokens = await handleGoogleAuth();

            console.log("Google auth tokens obtained:", authTokens);

            if (authTokens.accessToken) {
                console.log("Sending token to backend...");

                // Send the access token to your backend
                const response = await apiRequest("POST", "/accounts/auth/google/", {
                    access_token: authTokens.accessToken,
                    // scope: 'email profile openid'
                });

                console.log("Backend response:", response);

                // Handle successful login
                if (response.access || response.user) {
                    // Store token and user data
                    if (response.access) {
                        localStorage.setItem("authToken", response.access);
                    }

                    if (response.user) {
                        localStorage.setItem("userData", JSON.stringify(response.user));
                    }

                    setSuccess("Google login successful!");

                    // redirect to dashboard after a brief delay
                    setTimeout(() => {
                        router.push('/dashboard');
                        onClose();
                    }, 1000);

                } else {
                    setError(response.message || "Google login failed. Please try again.");
                }
            }
        } catch (err: any) {
            console.error("Google login error:", err);
            setError(err?.message || "Google authentication failed. Please try again.");
        } finally {
            setGoogleLoading(false);
        }
    };

    // Load Google script dynamically
    const loadGoogleScript = () => {
        return new Promise((resolve, reject) => {
            if (document.getElementById('google-oauth-script')) {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.id = 'google-oauth-script';
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => resolve(true);
            script.onerror = () => reject(new Error('Failed to load Google script'));
            document.head.appendChild(script);
        });
    };

    const handleGoogleAuth = (): Promise<{ idToken: string; accessToken: string }> => {
        return new Promise((resolve, reject) => {
            const client = (window as any).google.accounts.oauth2.initTokenClient({
                client_id: '200786604966-c92h7dbqfuj3h69bie70nq4atflk6u8m.apps.googleusercontent.com',
                scope: 'email profile openid',
                callback: async (response: any) => {
                    if (response.access_token) {
                        console.log("FUll Response Kausarrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", response)
                        console.log("Access token received:", response.access_token);
                        console.log("ID token received xxxxxxxxxxxxxxx:", response);
                        try {
                            // Get user info to obtain ID token
                            const userInfoResponse = await fetch(
                                'https://www.googleapis.com/oauth2/v3/userinfo',
                                {
                                    headers: {
                                        Authorization: `Bearer ${response.access_token}`
                                    }
                                }
                            );

                            if (!userInfoResponse.ok) {
                                reject(new Error('Failed to get user info'));
                                return;
                            }

                            const userInfo = await userInfoResponse.json();
                            console.log("User info: mamunnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn vai", userInfo);

                            resolve({
                                idToken: response.id_token, // Use access token as ID token
                                accessToken: response.access_token
                            });
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        reject(new Error('Failed to get access token'));
                    }
                },
                error_callback: (error: any) => {
                    reject(error);
                }
            });
            client.requestAccessToken();
        });
    };

    // Method 2: Redirect-based OAuth (More Reliable)
    const handleGoogleLoginRedirect = () => {
        setGoogleLoading(true);
        setError("");
        setSuccess("");

        const clientId = '784899934774-rcpd51tom6fgq54m0bitd2pcbe193tlg.apps.googleusercontent.com';
        const redirectUri = `${window.location.origin}`; // Redirect back to same page
        const scope = 'email profile openid';
        const state = Math.random().toString(36).substring(2); // CSRF protection

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&response_type=token` +
            `&scope=${encodeURIComponent(scope)}` +
            `&state=${state}` +
            `&include_granted_scopes=true` +
            `&prompt=consent`;

        // Store state in localStorage for verification
        localStorage.setItem('oauth_state', state);

        // Redirect to Google OAuth
        window.location.href = authUrl;
    };

    // Method 3: Popup window with message passing (Alternative)
    const handleGoogleLoginPopupWindow = () => {
        setGoogleLoading(true);
        setError("");
        setSuccess("");

        const clientId = '784899934774-rcpd51tom6fgq54m0bitd2pcbe193tlg.apps.googleusercontent.com';
        const redirectUri = `${window.location.origin}/auth-handler.html`; // You need to create this file
        const scope = 'email profile openid';

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&response_type=token` +
            `&scope=${encodeURIComponent(scope)}` +
            `&include_granted_scopes=true` +
            `&prompt=consent`;

        // Open popup window
        const popup = window.open(authUrl, 'googleAuth', 'width=500,height=600,left=100,top=100');

        // Check for popup block
        if (!popup) {
            setError("Popup blocked! Please allow popups for this site and try again.");
            setGoogleLoading(false);
            return;
        }

        // Listen for message from popup
        const messageHandler = async (event: MessageEvent) => {
            // Security check - verify origin
            if (event.origin !== window.location.origin) return;

            if (event.data.type === 'google-auth-success' && event.data.token) {
                window.removeEventListener('message', messageHandler);
                popup.close();

                try {
                    const response = await apiRequest("POST", "/accounts/auth/google/", {
                        access_token: event.data.token
                    });

                    if (response.access) {
                        localStorage.setItem("authToken", response.access);
                        localStorage.setItem("userData", JSON.stringify(response.user));
                        setSuccess("Google login successful!");

                        setTimeout(() => {
                            router.push('/dashboard');
                            onClose();
                        }, 1000);
                    } else {
                        setError(response.message || "Google login failed.");
                    }
                } catch (err: any) {
                    setError(err?.error || "Authentication failed.");
                } finally {
                    setGoogleLoading(false);
                }
            }

            if (event.data.type === 'google-auth-error') {
                window.removeEventListener('message', messageHandler);
                popup.close();
                setError(event.data.error);
                setGoogleLoading(false);
            }

            if (event.data.type === 'google-auth-closed') {
                window.removeEventListener('message', messageHandler);
                setGoogleLoading(false);
            }
        };

        window.addEventListener('message', messageHandler);

        // Check if popup is closed by user
        const checkPopup = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkPopup);
                window.removeEventListener('message', messageHandler);
                if (googleLoading) {
                    setGoogleLoading(false);
                    setError("Login cancelled by user.");
                }
            }
        }, 500);
    };

    // Combined Google login handler - tries popup first, falls back to redirect
    const handleGoogleLogin = async () => {
        // First try the Google Identity Services (most user-friendly)
        try {
            await handleGoogleLoginPopup();
        } catch (error) {
            console.log("Popup method failed, trying redirect...", error);
            // If popup fails, use redirect method
            handleGoogleLoginRedirect();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading && !googleLoading) {
            handleLogin();
        }
    };

    // Clear messages after delay
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError("");
                setSuccess("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    return (
        <div className="h-screen fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />

            <div className="relative bg-[#0A2131] text-white rounded-2xl w-full max-w-[550px] mx-auto drop-shadow-sm drop-shadow-[#0ABF9D66]">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 cursor-pointer text-white p-1"
                    disabled={isLoading || googleLoading}
                >
                    <X size={24} />
                </button>

                <div className="md:p-8 p-4">
                    <h2 className="text-2xl font-semibold text-white mb-3">Login</h2>
                    <p className="text-[#E5E5E5] font-medium mb-8">Let&apos;s login into your account first</p>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-300 text-sm">
                            {success}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    className="w-full p-3 pl-10 bg-[#0D314B] border border-[#007ED6] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                    disabled={isLoading || googleLoading}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    className="w-full p-3 pl-10 bg-[#0D314B] border border-[#007ED6] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                    disabled={isLoading || googleLoading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                    disabled={isLoading || googleLoading}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                                    disabled={isLoading || googleLoading}
                                />
                                <span className="ml-2 text-xs text-white">Remember Me</span>
                            </label>
                            <button
                                onClick={handleOpenForgetPasswordModal}
                                className="text-sm text-[#EB4335] cursor-pointer disabled:opacity-50"
                                disabled={isLoading || googleLoading}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={isLoading || googleLoading}
                            className="w-full bg-[#007ED6] text-white py-3 rounded-lg font-bold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading || googleLoading}
                            className="w-full bg-[#0D314B] border border-[#007ED6] text-white py-3 rounded-lg font-semibold drop-shadow-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {googleLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connecting to Google...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </button>

                        <div className="text-sm text-white">
                            Don&apos;t have an account?{" "}
                            <button
                                onClick={onSwitchToRegister}
                                className="text-[#0ABF9D] font-medium cursor-pointer disabled:opacity-50"
                                disabled={isLoading || googleLoading}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}