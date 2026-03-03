import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Spinner } from "@/components/ui/spinner";
import { Input } from '@/components/ui/input';
import { KeyRound } from "lucide-react";

const ResetPasswordPage = () => {

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })

  const [errors,setErrors] = useState({});

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {isUpdatingPassword} = useSelector(state => state.auth);

  const token = searchParams.get("token");

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value})); 

    if(errors[name]){
      setErrors(prev => ({...prev, [name]: ""}));
    }
  };

  // handleChange specially for shadecn
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};

    if(!formData.password){
      newErrors.password = "Password is required";
    } 
    else if(formData.password.length < 8){
      newErrors.password = "Password must be at least 8 characters";
    }
    if(!formData.confirmPassword){
      newErrors.password = "Confirm Password is required";
    } 
    else if(formData.password !== formData.confirmPassword){
      newErrors.password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
      if(!validateForm()){
        return;
      }

      try {
        await dispatch(resetPassword({
          token, 
          password: formData.password, 
          confirmPassword: formData.confirmPassword
        })).unwrap();

        navigate("/login");
      } catch (error) {
        setErrors({general: error || "Failed to reset password. Please try again"})
      }
  };

  return (
  <>
  <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div className="max-w-md w-full">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
          <KeyRound className="w-8 h-8 text-white"/>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Reset Password</h1>
        <p className="text-slate-600 mt-2">Enter your new password</p>
      </div>

      {/* Reset Password Form */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}


          {/* New Password */}

          <div className='w-full max-w-md space-y-2'>
            <Label htmlFor={id}>New Password</Label>
            <Input 
            id={id} 
            type='password' 
            placeholder='Enter new password' 
            name="password" 
            value={formData.password} 
            onChange={(e) => handleSelectChange("password", e.target.value)} 
            className={`input ${errors.password ? "input-error" : ""}`}
            />
            {
              errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )
            }
            <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => setIsVisible(prevState => !prevState)}
            className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
            >
              {isVisible ? <EyeOffIcon /> : <EyeIcon />}
              <span className='sr-only'>{isVisible ? 'Hide password' : 'Show password'}</span>
            </Button>
          </div>


          {/*Confirm Password */}

          <div className='w-full max-w-md space-y-2'>
            <Label htmlFor={id}>Confirm Password</Label>
            <div className='relative'>
            <Input 
            id={id} 
            type={isVisible ? 'text' : 'password'} 
            placeholder='Confirm your password' 
            className={`input ${errors.confirmPassword ? "input-error" : ""}`} 
            name="confirmPassword"
            value={formData.confirmPassword} 
            onChange={(e) => handleSelectChange("confirmPassword", e.target.value)}  />
              {
                errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                )
              }
            <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => setIsVisible(prevState => !prevState)}
            className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
            >
              {isVisible ? <EyeOffIcon /> : <EyeIcon />}
              <span className='sr-only'>{isVisible ? 'Hide password' : 'Show password'}</span>
            </Button>
            </div>
          </div>


          {/* Submit button */}
          <button type="submit" disabled={isUpdatingPassword} className="w-full bg-blue-500 hover:bg-blue-600/85 transition-all duration-100 rounded-md text-white  p-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {
              isUpdatingPassword ? (
                <div className="flex justify-center items-center gap-1">
                  <Spinner/>
                  Resetting...
                </div>
              ) : "Reset Password"
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

  </>
  );
};

export default ResetPasswordPage;
