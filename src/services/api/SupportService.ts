import { api } from "./index";

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  subject_id: string;
  station_id: string;
  staff_id?: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  created_at: string;
  updated_at: string;
  subject?: {
    id: string;
    name: string;
  };
  station?: {
    id: string;
    name: string;
    address: string;
  };
  support_images?: Array<{
    id: string;
    image_url: string;
  }>;
}

export interface CreateSupportTicketDto {
  title: string;
  description: string;
  subject_id: string;
  station_id: string;
  support_images?: Array<{ image_url: string }>; // Array of image objects
}

class SupportService {
  /**
   * Create a new support ticket
   */
  async createTicket(
    data: CreateSupportTicketDto
  ): Promise<{ data: SupportTicket }> {
    const response = await api.post<{ data: SupportTicket }>(
      "/support-tickets",
      data
    );
    return response.data;
  }

  /**
   * Get all support tickets for current user
   */
  async getMyTickets(): Promise<{ data: SupportTicket[] }> {
    const response = await api.get<{ data: SupportTicket[] }>(
      "/support-tickets/me"
    );
    return response.data;
  }

  /**
   * Get a single support ticket by ID
   */
  async getTicketById(ticketId: string): Promise<{ data: SupportTicket }> {
    const response = await api.get<{ data: SupportTicket }>(
      `/support-tickets/${ticketId}`
    );
    return response.data;
  }

  /**
   * Update a support ticket
   */
  async updateTicket(
    ticketId: string,
    data: Partial<CreateSupportTicketDto>
  ): Promise<{ data: SupportTicket }> {
    const response = await api.put<{ data: SupportTicket }>(
      `/support-tickets/${ticketId}`,
      data
    );
    return response.data;
  }
}

export default new SupportService();
