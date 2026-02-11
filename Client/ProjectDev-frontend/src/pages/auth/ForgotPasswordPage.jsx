import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";

const ForgotPasswordPage = () => {
  const [email,setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState("")
  const [error, setError] = useState("")

  const {isRequestingForToken} = useSelector((state) => state.auth)

  const dispatch = useDispatch();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!email) {
      setError("Email is required")
      return;
    } 
    if(!/\S+@\S+\.\S+/.test(formData.email)){
      setError("Email is invalid");
      return;
    }
    setError("")

    try {
      //await dispatch(forgotPassword({email})).unwrap();
      setIsSubmitted(true);
    } catch (error) {
      setError(error || "Failed to send reset link. Please try again later.")
    }
  };


  if(isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">

        {/* Success Icon + Heading */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Check Your Email
          </h1>

          <p className="text-slate-600 mt-2">
            We’ve sent a password reset link to your email address.
          </p>
        </div>

        {/* Card Message Section */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="text-center">
            <p className="text-slate-700 mb-4">
              If an account with{" "} <strong>{email}</strong> exists, you will receive a password reset email shortly.
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/login">Back to Login</Link>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
              >
                Send Another Email
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
);
  }

  return <>
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div className="max-w-md w-full">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
          <KeyRound className="w-8 h-8 text-white"/>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Forgot Password?</h1>
        <p className="text-slate-600 mt-2">Enter your email address and we'll send you a link to reset your password</p>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Email Address */}

          <div className='w-full max-w-md space-y-2'>
            <Label htmlFor={id}>Email Address</Label>
            <Input 
            id={id} 
            type='email' 
            placeholder='Enter your email' 
            name="email" 
            value={email} 
            onChange={(e) => {
              setEmail(e.target.value);
              if(error) {
                setError("");
              }
            }} 
            className={`input ${error ? "input-error" : ""}`}
            disabled={isRequestingForToken}
            />
            {
              error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
              )
            }
          </div>

          {/* Submit button */}
          <button type="submit" disabled={isRequestingForToken} className="w-full bg-blue-500 hover:bg-blue-600/85 transition-all duration-100 rounded-md text-white  p-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {
              isRequestingForToken ? (
                <div className="flex justify-center items-center gap-1">
                  <Spinner/>
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
              )
            }
          </button>

        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Remember your password? 
            <Link to={"/login"} className="text-blue-600 hover:text-blue-500 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
  </>;
};

export default ForgotPasswordPage;
