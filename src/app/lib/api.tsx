// lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method, InternalAxiosRequestConfig } from 'axios';

// Base API URL
const BASE_API = "https://backend.ajaxxdatascrubber.com";
// const BASE_API = "http://10.10.10.46:8000";

// Define generic API response type
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status?: number;
  [key: string]: unknown;
}

// Define error response type
export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
  [key: string]: unknown;
}

// Axios instance with proper typing
const api: AxiosInstance = axios.create({
  baseURL: BASE_API,
  // headers: {
  //   "Content-Type": "application/json",
  // },
  withCredentials: true,
});

// Generic API request method without 'any'
export const apiRequest = async <T = unknown>(
  method: Method,
  endpoint: string,
  data?: unknown,
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
  } catch (error: unknown) {
    const axiosError = error as {
      message: string;
      response?: {
        status?: number;
        data?: unknown;
      };
    };
    
    console.error("API Error:", axiosError.response?.data || axiosError.message);
    
    // Create a typed error object
    const apiError: ApiError = {
      message: axiosError.message,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
    };
    
    throw apiError;
  }
};

// Convenience methods without 'any'
export const apiGet = async <T = unknown>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>('GET', endpoint, undefined, config);
};

export const apiPost = async <T = unknown, D = unknown>(
  endpoint: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>('POST', endpoint, data, config);
};

export const apiPut = async <T = unknown, D = unknown>(
  endpoint: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>('PUT', endpoint, data, config);
};

export const apiPatch = async <T = unknown, D = unknown>(
  endpoint: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>('PATCH', endpoint, data, config);
};

export const apiDelete = async <T = unknown>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>('DELETE', endpoint, undefined, config);
};

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Add auth token or other headers here
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    const axiosError = error as {
      response?: {
        status?: number;
      };
    };
    
    // Handle global errors here
    if (axiosError.response?.status === 401) {
      // Redirect to login or refresh token
      console.log("Unauthorized, redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default api;