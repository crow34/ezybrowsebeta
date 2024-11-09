export interface Tab {
  id: string;
  title: string;
  url: string;
}

export interface VirtualPage {
  title: string;
  domain: string;
  elements: Array<{
    type: string;
    content: string;
    style?: {
      fontSize?: string;
      textAlign?: string;
    };
  }>;
  showMessageBoard: boolean;
  messages: string[];
  layout?: 'single' | 'grid';
  theme?: 'light' | 'dark';
  createdAt?: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'visitor' | 'free' | 'paid' | 'admin';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}