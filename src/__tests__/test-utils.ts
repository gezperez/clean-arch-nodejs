export const createMockRepository = () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
});

export const createMockEmailService = () => ({
  sendEmail: jest.fn(),
});

export const createMockAuthService = () => ({
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
});
