import { use, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddStudent from "../../components/modal/AddStudent";
import { createStudent, getAllUsers, updateStudent } from "@/store/slices/adminSlice";
import { CheckCircle, Plus, TriangleAlert, Users } from "lucide-react";
import { toggleStudentModal } from "@/store/slices/popupSlice";
import { Button } from "@/components/ui/button";

const ManageStudents = () => {

  const {users,projects} = useSelector(state => state.admin);
  const {isCreateStudentModalOpen} = useSelector(state => state.popup);

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const {formData, setFormData} = useState({
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
    </div>
  </>;
};

export default ManageStudents;
