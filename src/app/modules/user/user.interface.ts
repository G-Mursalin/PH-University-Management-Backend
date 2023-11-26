export type TUser = {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  isDeleted: boolean;
  status: 'in-progress' | 'blocked';
  role: 'admin' | 'student' | 'faculty';
};

 