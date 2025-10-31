import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import QuickSidebar from '../QuickSidebar';
import '@testing-library/jest-dom';

// Mock the AuthContext
const mockLogout = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('QuickSidebar', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Router>
        <QuickSidebar />
      </Router>
    );
  };

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('navigates to login page when logout button is clicked', () => {
    renderComponent();
    
    // Click the logout button
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    // Check if navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('clears localStorage when logout button is clicked', () => {
    // Setup localStorage spy
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    
    renderComponent();
    
    // Click the logout button
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    // Check if localStorage was cleared
    expect(removeItemSpy).toHaveBeenCalledWith('token');
    expect(removeItemSpy).toHaveBeenCalledWith('user');
    
    // Clean up
    removeItemSpy.mockRestore();
  });
});
