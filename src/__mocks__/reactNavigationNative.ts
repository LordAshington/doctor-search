const mockNavigate = jest.fn();

export const useNavigation = jest.fn(() => ({
  navigate: mockNavigate,
}));
