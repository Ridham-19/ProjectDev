import { use, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddStudent from "../../components/modal/AddStudent";
import { createStudent, deleteStudent, getAllUsers, updateStudent } from "@/store/slices/adminSlice";
import { AlertTriangle, CheckCircle, Plus, TriangleAlert, Users, X } from "lucide-react";
import { toggleStudentModal } from "@/store/slices/popupSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const ManageStudents = () => {

  const {users,projects} = useSelector(state => state.admin);
  const {isCreateStudentModalOpen} = useSelector(state => state.popup);

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  })

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);


  const students = useMemo(() => {
    const studentUsers = (users || []).filter(user => user.role?.toLowerCase() === "student");

    return studentUsers.map(student => {
      const studentProject = (projects || []).find(project => project.student?._id === student._id);
      return { 
        ...student, 
        projectTitle: studentProject?.title || null,
        supervisor: studentProject?.supervisor || null, 
        projectStatus: studentProject?.status || null,
      };
    });
  }, [users, projects]);


  const departments = useMemo(()=>{
    const set = new Set((students || []).map(student => student.department)
      .filter(Boolean));

    return Array.from(set);
  },[students])

  const filteredStudents = students.filter(student => {
    const matchesSearch = (student.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (student.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterDepartment === "all" || student.department === filterDepartment;

    return matchesSearch && matchesFilter;
  });

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      name: "",
      email: "",
      department: "",

    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if(editingStudent) {
      dispatch(updateStudent({id: editingStudent._id,data: formData}));
    } else {
      dispatch(createStudent(formData))
    }

    handleCloseModal();
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      department: student.department,
    });
    setShowModal(true);
  }

  const handleDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  }

  const confirmDelete = () => {
    if(studentToDelete) {
      dispatch(deleteStudent(studentToDelete._id));
      setShowDeleteModal(false);
      setStudentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  }


  return <>
    <div className="spacey-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-3 mb-3 pb-4">
        <div className="p-2 border-b border-slate-100 bg-white flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Manage Students</h1>
            <p className="text-sm text-slate-500 mt-1">Add, edit and manage student accounts</p>
          </div>

          <Button onClick={() => dispatch(toggleStudentModal())} className="btn-primary flex items-center space-x-2 mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600">
            <Plus className="w-5 h-5"/>
            <span>Add New Student</span>
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
              <p className="text-sm font-medium text-slate-600">Total Students</p>
              <p className="text-lg font-semibold text-slate-600">{students.length}</p>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-3">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <CheckCircle className="w-6 h-6 text-purple-600"/>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Completed Projects</p>
              <p className="text-lg font-semibold text-slate-600">{students.filter((s) => s.status === "completed").length}</p>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-3">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <TriangleAlert className="w-6 h-6 text-yellow-600"/>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Unassigned</p>
              <p className="text-lg font-semibold text-slate-600">{students.filter((s) => !s.supervisor).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-3 mt-3 mb-3">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2 ">Search Students</label>
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

      {/* STUDENTS TABLE */}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-3 mt-3 mb-3">
        <div className="p-3 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Students list</h2>
        </div>
        <div className="overflow-x-auto"> 

            {filteredStudents && filteredStudents.length > 0 ? (
              <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Student Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Department & Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Supervisor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Project Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-200">
              {
                filteredStudents.map(student => {
                  return (
                    <tr key={student._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{student.name}</div>
                          <div className="text-sm text-slate-500">{student.email}</div>
                          {
                            student.studentID && (
                              <div className="text-xs text-slate-400">ID: {student.studentID}</div>
                            )
                          }
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{student.department || "-"}</div>
                        <div className="text-sm text-slate-500">
                          {
                          student.createdAt ? new Date(student.createdAt).getFullYear() : "-"
                          }
                        </div>
                        
                      </td>


                      <td className="px-6 py-4 whitespace-nowrap">
                        {
                          student.supervisor ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-green-800 bg-gray-100 text-xs font-medium">
                              { typeof student.supervisor === "object" ? student.supervisor.name || "-": student.supervisor }
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-red-800 bg-red-100 text-xs font-medium">
                              {student.projectStatus === "rejected" ? "Project Rejected" : "Not assigned"}
                            </span>
                          )
                        }
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900 ">{student.projectTitle || "-"}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button onClick={() => handleEdit(student)} className="text-blue-500 hover:text-blue-700 bg-slate-100 hover:bg-blue-100">
                            Edit
                          </Button>
                          <Button onClick={() => handleDelete(student)} className="text-red-500 hover:text-red-700 bg-slate-100 hover:bg-red-100">
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
                  <p className="text-sm text-slate-500 mt-2">No students found matching your search criteria.</p>
                </div>
              )
            }
          
        </div>

        {/* Edit student modal */}  

        {
          showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                {/* Modal header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Edit Student
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
          showDeleteModal && studentToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="flex shrink-0 w-10 h-10 mx-auto items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="w-6 h-6 text-red-600"/>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Delete Student</h3>
                  <p className="text-sm mb-4 text-slate-500">Are you sure you want to delete{" "}
                    <span className="font-medium">{studentToDelete.name}</span>? This action cannot be undone.
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

      </div>

    </div>
  </>;
};

export default ManageStudents;
