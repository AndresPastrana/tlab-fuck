import { RouteObject } from "react-router-dom";

import PagePersonas from "../pages/admin/Personas";
import AdminLayout from "../layouts/AdminLayout";
import ProfesorView from "../pages/admin/professors/ProfesorView";
import CreateProfesorsView from "../pages/admin/professors/CreateProfesorsView";
import EditProfesorView from "../pages/admin/professors/EditProfessorView";
import StudentsView from "../pages/admin/students/StudentsView";
import CreateStudentView from "../pages/admin/students/CreateStudentView";
import HistoryView from "../pages/admin/students/HistoryView";
import EditStudentView from "../pages/admin/students/EditStudentView";
import CourtsView from "../pages/admin/courts/CourtsView";
import ProyectsView from "../pages/admin/proyects/ProyectsView";
import CreateProyectView from "../pages/admin/proyects/CreateProyectView";
import Evaluaciones from "../pages/admin/evaluaciones/Evaluaciones";
import { EvaluationsFilterProvider } from "../context/EvaluationFilterContext";
import { EvalSubmissions } from "../pages/admin/evaluaciones/EvalSubmissions";
import DefenseCreationComponent from "../components/admin/defense/CreateNewDefense";
import Search from "../pages/admin/search/Search";

export const AdminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { path: "personas/", element: <PagePersonas /> },
    { path: "courts/", element: <CourtsView /> },
    { path: "personas/profesors", element: <ProfesorView /> },
    { path: "personas/students", element: <StudentsView /> },
    { path: "personas/profesors/create", element: <CreateProfesorsView /> },
    { path: "personas/students/create", element: <CreateStudentView /> },
    { path: "proyectos/", element: <ProyectsView /> },
    { path: "search/", element: <Search /> },

    {
      path: "proyectos/create",
      element: <CreateProyectView />,
    },

    {
      path: "defense/",

      children: [
        { index: true, element: <h1>Lista de defensas</h1> },
        {
          path: "create",
          element: <DefenseCreationComponent />,
        },
      ],
    },
    {
      path: "evaluaciones/",
      element: (
        <EvaluationsFilterProvider>
          <Evaluaciones />
        </EvaluationsFilterProvider>
      ),
    },

    {
      path: "evaluaciones/:id/submissions",
      element: <EvalSubmissions />,
    },
    {
      path: "personas/profesors/edit/:id",
      element: <EditProfesorView />,
    },
    {
      path: "personas/students/edit/:id",
      element: <EditStudentView />,
    },
    {
      path: "personas/students/:id/historial",
      element: <HistoryView />,
    },
  ],
};
