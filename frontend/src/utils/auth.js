// Authentication utility for Justice Chain
export class AuthService {
  static CITIZEN_STORAGE_KEY = 'justice_chain_citizen_auth';
  static ADMIN_STORAGE_KEY = 'justice_chain_admin_auth';

  // Demo credentials (in real app, this would be handled by backend)
  static DEMO_CREDENTIALS = {
    citizens: [
      { email: 'user@example.com', password: 'password123' },
      { email: 'citizen@gmail.com', password: 'citizen123' }
    ],
    admins: [
      { email: 'admin@justice.gov.in', password: 'admin123' },
      { email: 'officer@police.gov.in', password: 'officer123' }
    ]
  };

  // Login function for citizens
  static loginCitizen(email, password) {
    const citizen = this.DEMO_CREDENTIALS.citizens.find(
      c => c.email === email && c.password === password
    );
    
    if (citizen) {
      const authData = {
        email: citizen.email,
        loginTime: new Date().toISOString(),
        userType: 'citizen'
      };
      localStorage.setItem(this.CITIZEN_STORAGE_KEY, JSON.stringify(authData));
      return { success: true, user: authData };
    }
    
    return { success: false, error: 'Invalid credentials' };
  }

  // Login function for admins
  static loginAdmin(email, password) {
    const admin = this.DEMO_CREDENTIALS.admins.find(
      a => a.email === email && a.password === password
    );
    
    if (admin) {
      const authData = {
        email: admin.email,
        loginTime: new Date().toISOString(),
        userType: 'admin'
      };
      localStorage.setItem(this.ADMIN_STORAGE_KEY, JSON.stringify(authData));
      return { success: true, user: authData };
    }
    
    return { success: false, error: 'Invalid credentials' };
  }

  // Check if citizen is logged in
  static isAuthenticated(userType = 'citizen') {
    const key = userType === 'citizen' ? this.CITIZEN_STORAGE_KEY : this.ADMIN_STORAGE_KEY;
    const authData = localStorage.getItem(key);
    return authData ? JSON.parse(authData) : null;
  }

  // Logout function
  static logout(userType = 'citizen') {
    const key = userType === 'citizen' ? this.CITIZEN_STORAGE_KEY : this.ADMIN_STORAGE_KEY;
    localStorage.removeItem(key);
  }

  // Get current user
  static getCurrentUser(userType = 'citizen') {
    return this.isAuthenticated(userType);
  }
}