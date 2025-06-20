// Authentication utility for Justice Chain
export class AuthService {
  static CITIZEN_STORAGE_KEY = 'justice_chain_citizen_auth';
  static ADMIN_STORAGE_KEY = 'justice_chain_admin_auth';
  static CITIZEN_USERS_KEY = 'justice_chain_citizen_users';
  static ADMIN_USERS_KEY = 'justice_chain_admin_users';

  // Demo credentials (in real app, this would be handled by backend)
  static DEMO_CREDENTIALS = {
    citizens: [
      { email: 'user@example.com', password: 'password123', fullName: 'Demo User', phone: '9876543210' },
      { email: 'citizen@gmail.com', password: 'citizen123', fullName: 'Test Citizen', phone: '9876543211' }
    ],
    admins: [
      { email: 'admin@justice.gov.in', password: 'admin123', fullName: 'Admin Officer', empId: 'ADM001' },
      { email: 'officer@police.gov.in', password: 'officer123', fullName: 'Police Officer', empId: 'POL001' }
    ]
  };

  // Initialize users storage with demo credentials if not exists
  static initializeUsers() {
    if (!localStorage.getItem(this.CITIZEN_USERS_KEY)) {
      localStorage.setItem(this.CITIZEN_USERS_KEY, JSON.stringify(this.DEMO_CREDENTIALS.citizens));
    }
    if (!localStorage.getItem(this.ADMIN_USERS_KEY)) {
      localStorage.setItem(this.ADMIN_USERS_KEY, JSON.stringify(this.DEMO_CREDENTIALS.admins));
    }
  }

  // Get all users of a specific type
  static getAllUsers(userType = 'citizen') {
    this.initializeUsers();
    const key = userType === 'citizen' ? this.CITIZEN_USERS_KEY : this.ADMIN_USERS_KEY;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  // Save users to localStorage
  static saveUsers(users, userType = 'citizen') {
    const key = userType === 'citizen' ? this.CITIZEN_USERS_KEY : this.ADMIN_USERS_KEY;
    localStorage.setItem(key, JSON.stringify(users));
  }

  // Signup function for citizens
  static signupCitizen(userData) {
    this.initializeUsers();
    const users = this.getAllUsers('citizen');
    
    // Check if email already exists
    if (users.find(user => user.email === userData.email)) {
      return { success: false, error: 'Email already registered' };
    }

    // Add new user
    const newUser = {
      ...userData,
      registrationDate: new Date().toISOString()
    };
    users.push(newUser);
    this.saveUsers(users, 'citizen');
    
    return { success: true, message: 'Registration successful' };
  }

  // Signup function for admins
  static signupAdmin(userData) {
    this.initializeUsers();
    const users = this.getAllUsers('admin');
    
    // Check if email already exists
    if (users.find(user => user.email === userData.email)) {
      return { success: false, error: 'Email already registered' };
    }

    // Add new admin
    const newAdmin = {
      ...userData,
      registrationDate: new Date().toISOString()
    };
    users.push(newAdmin);
    this.saveUsers(users, 'admin');
    
    return { success: true, message: 'Admin registration successful' };
  }

  // Login function for citizens
  static loginCitizen(email, password) {
    const users = this.getAllUsers('citizen');
    const citizen = users.find(c => c.email === email && c.password === password);
    
    if (citizen) {
      const authData = {
        email: citizen.email,
        fullName: citizen.fullName || 'User',
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
    const users = this.getAllUsers('admin');
    const admin = users.find(a => a.email === email && a.password === password);
    
    if (admin) {
      const authData = {
        email: admin.email,
        fullName: admin.fullName || 'Admin',
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