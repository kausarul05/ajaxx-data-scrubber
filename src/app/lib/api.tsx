// lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';

// Base API URL
const BASE_API = "http://10.10.10.46:8000";

// Define response data type (adjust based on your API response structure)
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
  [key: string]: any;
}

// Define error response type
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
  [key: string]: any;
}

// Axios instance with proper typing
const api: AxiosInstance = axios.create({
  baseURL: BASE_API,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Generic API request method with TypeScript
export const apiRequest = async <T = any>(
  method: Method,
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await api({
      method,
      url: endpoint,
      data,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    
    // Create a typed error object
    const apiError: ApiError = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    
    throw apiError;
  }
};

// Convenience methods with proper typing
export const apiGet = async <T = any>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>('GET', endpoint, undefined, config);
};

export const apiPost = async <T = any>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>('POST', endpoint, data, config);
};

export const apiPut = async <T = any>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>('PUT', endpoint, data, config);
};

export const apiPatch = async <T = any>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>('PATCH', endpoint, data, config);
};

export const apiDelete = async <T = any>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>('DELETE', endpoint, undefined, config);
};

// You can also add interceptors if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token or other headers here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      console.log("Unauthorized, redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default api;