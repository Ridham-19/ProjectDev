import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddTeacher from "../../components/modal/AddTeacher";
import { createStudent, deleteStudent, getAllUsers, updateStudent } from "@/store/slices/adminSlice";
import { AlertTriangle, CheckCircle, Plus, TriangleAlert, Users, X } from "lucide-react";
import { toggleStudentModal } from "@/store/slices/popupSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const ManageTeachers = () => {
  
    const {users} = useSelector(state => state.admin);
    const {isCreateTeacherModalOpen} = useSelector(state => state.popup);
  
    const [showModal, setShowModal] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDepartment, setFilterDepartment] = useState("all");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);
  
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      department: "",
      expertise: "",
      maxStudents: 10,
    })
  
    const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(getAllUsers());
    }, [dispatch]);
  
  
    const teachers = useMemo(() => {
      return (users || []).filter(user => user.role?.toLowerCase() === "teacher");
    }, [users]);
  
  
    const departments = useMemo(()=>{
      const set = new Set((teachers || []).map(teacher => teacher.department)
        .filter(Boolean));
  
      return Array.from(set);
    },[teachers])
  
    const filteredTeachers = teachers.filter(teacher => {
      const matchesSearch = (teacher.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (teacher.email || "").toLowerCase().includes(searchTerm.toLowerCase());
  
      const matchesFilter = filterDepartment === "all" || teacher.department === filterDepartment;
  
      return matchesSearch && matchesFilter;
    });

    const handleCloseModal = () => {
      setShowModal(false);
      setEditingTeacher(null);
      setFormData({
        name: "",
        email: "",
        department: "",
        expertise: "",
        maxStudents: 10,
      })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if(editingTeacher) {
          dispatch(updateTeacher({id: editingTeacher._id,data: formData}));
        }
    
        handleCloseModal();
      };
    
      const handleEdit = (teacher) => {
        setEditingTeacher(teacher);
        setFormData({
          name: teacher.name,
          email: teacher.email,
          department: teacher.department,
          expertise: Array.isArray(teacher.expertise)? teacher.expertise[0] : (teacher.expertise),
          maxStudents: typeof teacher.maxStudents === "number" ? teacher.maxStudents : 10,
        });
        setShowModal(true);
      }
    
      const handleDelete = (teacher) => {
        setTeacherToDelete(teacher);
        setShowDeleteModal(true);
      }
    
      const confirmDelete = () => {
        if(teacherToDelete) {
          dispatch(deleteTeacher(teacherToDelete._id));
          setShowDeleteModal(false);
          setTeacherToDelete(null);
        }
      };
    
      const cancelDelete = () => {
        setShowDeleteModal(false);
        setTeacherToDelete(null);
      }



  return (
  <>
    <div className="spacey-6">
          {/* Header */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-3 mb-3 pb-4">
            <div className="p-2 border-b border-slate-100 bg-white flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="">
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">Manage Teachers</h1>
                <p className="text-sm text-slate-500 mt-1">Add, edit and manage teacher accounts</p>
              </div>
    
              <Button onClick={() => dispatch(toggleTeacherModal())} className="btn-primary flex items-center space-x-2 mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600">
                <Plus className="w-5 h-5"/>
                <span>Add New Teacher</span>
              </Button>
            </div>
          </div>
    
    
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-3">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Users className="w-6 h-6 text-blue-600"/>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Teachers</p>
                  <p className="text-lg font-semibold text-slate-600">{teachers.length}</p>
                </div>
              </div>
            </div>
    
    
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-3">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <User className="w-6 h-6 text-purple-600"/>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Assigned Students</p>
                  <p className="text-lg font-semibold text-slate-600">
                    {teachers.reduce((sum, teacher) => sum + (teacher.assignedStudents?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
    
    
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-3">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <TriangleAlert className="w-6 h-6 text-yellow-600"/>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Departments</p>
                  <p className="text-lg font-semibold text-slate-600">{departments.length}</p>
                </div>
              </div>
            </div>
          </div>
    
          {/* FILTERS */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-3 mt-3 mb-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2 ">Search Teachers</label>
                <input 
                  type="text" 
                  placeholder="Search by name or email..."
                  className="input-field w-full pt-1 rounded-md focus:outline-none" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
    
              <div className="w-full md:w-48">
                <label htmlFor="department-filter" className="block text-sm font-medium text-slate-700 mb-2 focus:outline-none">Filter by Department</label>
                <Select defaultValue={filterDepartment} onValueChange={(e) => setFilterDepartment(e)} className="w-full md:w-48 focus:outline-none after:outline-none">
                  <SelectTrigger id={filterDepartment} className='w-full focus:outline-none'>
                    <SelectValue placeholder='All Departments' className="w-full border-slate-200"/>
                  </SelectTrigger>
                  <SelectContent className="w-full md:w-48 focus:outline-none">
                    <SelectGroup>
                      <SelectLabel className="w-full focus:outline-none">Departments</SelectLabel>
                      <SelectItem value='all' className="w-full focus:outline-none">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept} className="w-full focus:outline-none">
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
    
          {/* TEACHERS TABLE */}
    
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-3 mt-3 mb-3">
            <div className="p-3 border-b border-slate-100 bg-white">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Teachers list</h2>
            </div>
            <div className="overflow-x-auto"> 
    
                {filteredTeachers && filteredTeachers.length > 0 ? (
                  <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Teacher Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Expertise
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
    
                <tbody className="bg-white divide-y divide-slate-200">
                  {
                    filteredTeachers.map(teacher => {
                      return (
                        <tr key={teacher._id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-slate-900">{teacher.name}</div>
                              <div className="text-sm text-slate-500">{teacher.email}</div>
                            </div>
                          </td>
    
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">{teacher.department || "-"}</div>
                            
                            
                          </td>
    
    
                          <td className="px-6 py-4 whitespace-nowrap">

                            {
                              Array.isArray(teacher.expertise) && teacher.expertise.length > 0  
                                
                            }
                            {
                              teacher.expertise && teacher.expertise.length>0 ? (
                                <div className="text-sm font-medium text-slate-900">
                                  {teacher.expertise.join(", ")}
                                </div>
                              ) : teacher.expertise 
                            }
                          </td>
    
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900 ">
                              {teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : "-"}
                            </div>
                          </td>
    
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button onClick={() => handleEdit(teacher)} className="text-blue-500 hover:text-blue-700 bg-slate-100 hover:bg-blue-100">
                                Edit
                              </Button>
                              <Button onClick={() => handleDelete(teacher)} className="text-red-500 hover:text-red-700 bg-slate-100 hover:bg-red-100">
                                Delete
                              </Button>
                            </div>
                          </td>
    
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
                ) : (
                    <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden p-3 mt-3 mb-3 flex flex-col items-center justify-center">
                      <p className="text-sm text-slate-500 mt-2">No teachers found matching your search criteria.</p>
                    </div>
                  )
                }
              
            </div>
    
            {/* Edit teacher modal */}  
    
            {
              showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                    {/* Modal header */}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Edit Teacher
                      </h3>
                      <button onClick={handleCloseModal} className="text-slate-500 hover:text-slate-700 ">
                        <X className="w-6 h-6"/>
                      </button>
                    </div>
    
                    {/* Modal  */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="">
                        <label className="block text-sm font-medium text-slate-700 mb-1 focus:outline-none">
                          Full Name
                        </label>
                        <Input 
                          type="text" 
                          required 
                          value={formData.name} 
                          onChange={(e)=> setFormData({...formData, name:e.target.value})}
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
                          onChange={(e)=> setFormData({...formData, email:e.target.value})}
                          className="!ring-0 w-full focus:outline-none"
                        />
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
                        <Button type="button" className="text-red-500 hover:text-red-700 bg-slate-100 hover:bg-red-100" onClick={handleCloseModal}>Cancel</Button>
    
                        <Button type="submit" className="text-blue-500 hover:text-blue-700 bg-slate-100 hover:bg-blue-100" onClick={handleSubmit}>Save Changes</Button>
                      </div>
    
                    </form>
                  </div>
                </div>
              )
            }
    
            {
              showDeleteModal && teacherToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
                    <div className="flex items-center mb-4">
                      <div className="flex shrink-0 w-10 h-10 mx-auto items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="w-6 h-6 text-red-600"/>
                      </div>
                    </div>
    
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Delete Teacher</h3>
                      <p className="text-sm mb-4 text-slate-500">Are you sure you want to delete{" "}
                        <span className="font-medium">{teacherToDelete.name}</span>? This action cannot be undone.
                      </p>
    
                      <div className="flex justify-center space-x-3">
                        <Button onClick={cancelDelete} className="text-blue-500 hover:text-blue-700 bg-slate-100 hover:bg-blue-100">Cancel</Button>
                        <Button onClick={confirmDelete} className="text-red-500 hover:text-red-700 bg-slate-100 hover:bg-red-100">Delete</Button>
                      </div>
                      
                    </div>
                  </div>
                </div>
              )
            }
    
            {
              isCreateTeacherModalOpen && <AddTeacher />
            }
    
          </div>
    
        </div>
  </>
  )
};

export default ManageTeachers;
