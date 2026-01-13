export default function Navbar({ user, logout }) {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <h1 className="font-bold">Dheaypurti Police Bharti</h1>
      {user && (
        <div>
          <span className="mr-4">{user.name}</span>
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
