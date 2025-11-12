import { api } from "./index";

export interface SupportSubject {
  id: string;
  name: string;
  description?: string;
  parent_id?: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

class SupportSubjectService {
  /**
   * Get all active support subjects
   */
  async getActiveSubjects(): Promise<{ data: SupportSubject[] }> {
    const response = await api.get<{ data: SupportSubject[] }>(
      "/support-subjects",
      {
        params: {
          status: "active",
        },
      }
    );
    return response.data;
  }

  /**
   * Get a single support subject by ID
   */
  async getSubjectById(subjectId: string): Promise<{ data: SupportSubject }> {
    const response = await api.get<{ data: SupportSubject }>(
      `/support-subjects/${subjectId}`
    );
    return response.data;
  }
}

export default new SupportSubjectService();
