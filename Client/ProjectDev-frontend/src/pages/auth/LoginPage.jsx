import { use, useEffect, useState, useId} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slices/authSlice";
import {BookOpen} from "lucide-react";
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const LoginPage = () => {

  const dispatch = useDispatch();

  const {isLoggingIn, authUser} = useSelector(state => state.auth); 

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Student",
  });

  const [errors, setErrors] = useState({})
  const navigate = useNavigate();
  
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
    if(!formData.email){
      newErrors.email = "Email is required";
    }
    else if(!/\S+@\S+\.\S+/.test(formData.email)){
      newErrors.email = "Email is invalid";
    }

    if(!formData.password){
      newErrors.password = "Password is required";
    } 
    else if(formData.password.length < 8){
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!validateForm()){
      return;
    }
    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role);

    dispatch(login(data));
  };

  useEffect(() => {
    if(authUser){
      switch (formData.role) {
        case "Student":
          navigate("/student");
          break;
        case "Teacher":
          navigate("/teacher");
          break;
        case "Admin":
          navigate("/admin");
          break;
        default:
          navigate("/login");
      }
    }
  }, [authUser]);

  const id = useId();

  return (
  <>
  <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div className="max-w-md w-full">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-white"/>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">ProjectDev</h1>
        <p className="text-slate-600 mt-2">Sign in to your account</p>
      </div>

      {/* Login Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Role Selection */}

          <div>
            <Label htmlFor={id}>Select Role</Label>
            <Select defaultValue={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
              <SelectTrigger id={id} className='w-full '>
                <SelectValue placeholder='Select a role'/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  <SelectItem value='Student'>Student</SelectItem>
                  <SelectItem value='Teacher'>Teacher</SelectItem>
                  <SelectItem value='Admin'>Admin</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

        </form>
      </div>
    </div>
  </div>

  </>
  );
};

export default LoginPage;
