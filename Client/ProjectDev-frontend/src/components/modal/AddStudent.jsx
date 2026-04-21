import { createStudent } from "@/store/slices/adminSlice";
import { toggleStudentModal } from "@/store/slices/popupSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


const AddStudent = () => {

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    password: "",
  })

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    const result = await dispatch(createStudent(formData));
    if (createStudent.fulfilled.match(result)) {
      setFormData({
        name: "",
        email: "",
        department: "",
        password: "",
      });
    }
    dispatch(toggleStudentModal());
  }

  // For password section
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          {/* Modal header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Add Student
            </h3>
            <button onClick={() => { dispatch(toggleStudentModal()) }} className="text-slate-500 hover:text-slate-700 ">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal  */}
          <form onSubmit={handleCreateStudent} className="space-y-4">
            <div className="">
              <label className="block text-sm font-medium text-slate-700 mb-1 focus:outline-none">
                Full Name
              </label>
              <Input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="!ring-0 w-full focus:outline-none"
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-slate-700 mb-1 focus:outline-none">
                Email
              </label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="!ring-0 w-full focus:outline-none"
              />
            </div>
            <div className="relative"> 
              <label className="block text-sm font-medium text-slate-700 mb-1 focus:outline-none">
                Password
              </label>
              <div className="relative">
                <Input
                  type={isVisible ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="!ring-0 w-full focus:outline-none pr-10" 
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsVisible(prevState => !prevState)}
                  className='absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent text-slate-500' 
                >
                  {isVisible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="">
              <label className="block text-sm font-medium text-slate-700 mb-1 focus:outline-none">
                Department
              </label>

              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value })
                }
              >
                <SelectTrigger className="!ring-0 w-full focus:outline-none mb-2">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Information Technology">Information Technology</SelectItem>
                  <SelectItem value="AIDS">AI and Data Science</SelectItem>
                  <SelectItem value="CSE DS">CSE Data Science</SelectItem>
                  <SelectItem value="Electrical engineering">Electrical engineering</SelectItem>
                  <SelectItem value="ECE">Electronics and Communication engineering</SelectItem>
                  <SelectItem value="Mechanical engineering">Mechanical engineering</SelectItem>
                </SelectContent>


              </Select>

            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" className="text-red-500 hover:text-red-700 bg-slate-100 hover:bg-red-100" onClick={() => { dispatch(toggleStudentModal()) }}>Cancel</Button>

              <Button type="submit" className="text-blue-500 hover:text-blue-700 bg-slate-100 hover:bg-blue-100">Add Student</Button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default AddStudent;
