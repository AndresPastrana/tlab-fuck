import { createBrowserRouter } from "react-router-dom";
import { AdminRoutes } from "./admin.routes";
import { Root } from "./root.router";
import { AuthRoutes } from "./auth.routes";
import { StudentRoutes } from "./student.routes";
import { ProfessorRoutes } from "./professor.routes";
import CreateSubmission from "../pages/student/CreateSubmission";
import Unauthorized from "../components/error/Unahtorized";
// import PageLogin from "../pages/auth/login";

export const router = createBrowserRouter([
  Root,
  AdminRoutes,
  AuthRoutes,
  StudentRoutes,
  ProfessorRoutes,
  {
    path: "/test",
    element: <CreateSubmission />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);
