export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Guest';
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export const MOCK_USERS: User[] = [
  { id: 'user_001', name: '김철수', email: 'kim@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-15' },
  { id: 'user_002', name: '이영희', email: 'lee@example.com', role: 'User', status: 'Active', lastLogin: '2024-01-18' },
  { id: 'user_003', name: '박민수', email: 'park@example.com', role: 'User', status: 'Inactive', lastLogin: '2023-12-20' },
  { id: 'user_004', name: '최지우', email: 'choi@example.com', role: 'Guest', status: 'Active', lastLogin: '2024-01-19' },
  { id: 'user_005', name: '정우성', email: 'jung@example.com', role: 'User', status: 'Active', lastLogin: '2024-01-10' },
];