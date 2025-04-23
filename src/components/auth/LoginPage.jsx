import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Login page component that integrates with ApperUI for authentication
 * @returns {JSX.Element} The LoginPage component
 */
function LoginPage() {
  const { setupAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Set up authentication UI when component mounts
  useEffect(() => {
    // If the user is already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      navigate('/dashboard');
      return;
    }
    
    // Set up authentication UI with ApperUI
    setupAuth('#authentication');
  }, [setupAuth, isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to TaskFlow
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>
        
        {/* This div will be populated by ApperUI */}
        <div 
          id="authentication" 
          className="min-h-[400px] flex items-center justify-center"
        ></div>
      </div>
    </div>
  );
}

export default LoginPage;