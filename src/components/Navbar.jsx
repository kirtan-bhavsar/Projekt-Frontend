import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center bg-white shadow-md px-6 py-3 sticky top-0 z-10">
      <h2 className="text-xl font-semibold text-gray-700">
        Welcome, {user?.name || "User"} 👋
      </h2>
      <div className="flex items-center space-x-4">
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
