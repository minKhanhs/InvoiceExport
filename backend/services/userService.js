let mockUsers = [];

exports.getUsers = async () => {
  return mockUsers;
};

exports.createUser = async (userData) => {
  const newUser = { id: Date.now(), ...userData };
  mockUsers.push(newUser);
  return newUser;
};
