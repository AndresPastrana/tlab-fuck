// useProjects.js
import useSWR from "swr";
import axios, { AxiosRequestConfig } from "axios";
import {
  ApiResponse,
  CreateProjectData,
  PopulatedTesisResponse,
} from "../types"; // Adjust the import based on your actual path
import { useAuth } from "./useAuth"; // Adjust the import based on your actual path
import { UserRole } from "../const";
import { useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API;

interface FetcherOptions extends AxiosRequestConfig {
  token: string;
  // You can add any additional options you need
}

const fetcher = async (url: string, { token, ...options }: FetcherOptions) => {
  try {
    const response = await axios.get<ApiResponse<PopulatedTesisResponse[]>>(
      url,
      {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.msg);
    }
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

/**
 * Fetches projects data from the server.
 * @param {boolean} active - Indicates whether to fetch active projects or not.
 * @returns {Object} An object containing projects data, loading state, and error information.
 */
export const useProjects = (active: boolean = true) => {
  const { token, user } = useAuth(); // Assuming useAuth returns the token

  const projectsUrl = `${API_BASE_URL}${
    import.meta.env.VITE_PROJECT
  }?active=${active}`;

  const {
    data: projects,
    error,
    mutate,
  } = useSWR(
    projectsUrl,
    (url: string) => fetcher(url, { token: token as string }) // Pass token as a parameter
  );
  UserRole.Student;
  /**
   * Creates a new project.
   * @param {Object} data - Project data including "topic", "general_target", and "scientific_problem".
   * @param {string} data.topic - The topic of the project.
   * @param {string} data.general_target - The general target of the project.
   * @param {string} data.scientific_problem - The scientific problem addressed by the project.
   * @param {string} data.student - (Optional) The student associated with the project.
   * @param {string[]} data.tutors - (Optional) An array of tutor id associated with the project.
   * @returns {Promise<Object>} A promise that resolves to the created project data if successful.
   * @throws {Error} If there is an issue creating the project.
   */
  const createNewProject = async (data: CreateProjectData): Promise<void> => {
    try {
      // Create a new project by sending a POST request
      const response = await axios.post<ApiResponse<PopulatedTesisResponse>>(
        `${API_BASE_URL}${import.meta.env.VITE_PROJECT}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Optionally, you can update the local state or perform any actions upon successful creation
        console.log("Project created successfully:", response.data.data);

        // Return the created project data
        mutate();
      } else {
        // Handle server response indicating failure
        throw new Error(response.data.msg || "Failed to create project");
      }
    } catch (error) {
      // Handle network errors or other issues
      console.error("Error creating project:", error);

      // Throw an error indicating failure to create the project
      throw new Error("Failed to create project");
    }
  };

  /**
   * Gets projects information based on the member ID and type.
   * @param {string} memberId - The ID of the member (student or professor).
   * @param {UserRole.Student | UserRole.Profesor} memberType - The type of the member (student or professor).
   * @returns {Promise<PopulatedTesisResponse | PopulatedTesisResponse[]>} A promise that resolves to the projects data.
   * @throws {Error} If there is an issue fetching projects.
   */
  const fetchProjectsByMemberId = useCallback(
    async (): Promise<PopulatedTesisResponse | PopulatedTesisResponse[]> => {
      try {
        if (!user) {
          throw new Error("User is undefined or null");
        }

        const url = `${API_BASE_URL}${
          import.meta.env.VITE_PROJECT
        }/byMember?active=${active}&memberId=${user.userId}&memberType=${
          user.role
        }`;

        const resp = await axios.get<
          ApiResponse<PopulatedTesisResponse | PopulatedTesisResponse[]>
        >(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (resp.data.success) {
          return resp.data.data;
        } else {
          throw new Error(resp.data.msg || "Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        throw new Error("Failed to fetch projects");
      }
    },
    [token, user, active] // Include dependencies in the dependency array
  );

  return {
    projects: projects || [],
    isLoading: !projects && !error,
    isError: !!error,
    error,

    createNewProject,
    getProjectsInfoByMemberId: fetchProjectsByMemberId,
  };
};
