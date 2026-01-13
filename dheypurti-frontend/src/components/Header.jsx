import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <header className="bg-blue-600 text-white py-6 px-4 flex justify-between items-center relative">
        <h1 className="text-3xl font-bold text-center w-full">Dheypurti Academy</h1>
        <button onClick={() => setOpenMenu(true)} className="text-3xl font-bold absolute right-4 top-4">⋮</button>
      </header>

      {/* Side Navigation Drawer */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform ${openMenu ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={() => setOpenMenu(false)} className="text-2xl">✕</button>
        </div>
        <nav className="flex flex-col p-4 gap-4">
          <Link to="/" onClick={() => setOpenMenu(false)} className="text-blue-600 hover:underline">Home</Link>
          {/* <Link to="/login" onClick={() => setOpenMenu(false)} className="text-blue-600 hover:underline">Student Login</Link> */}
          <Link to="/login" onClick={() => setOpenMenu(false)} className="text-blue-600 hover:underline">Login</Link>
          {/* <Link to="/owner" onClick={() => setOpenMenu(false)} className="text-blue-600 hover:underline">Owner Login</Link> */}
          {/* <Link to="/about" onClick={() => setOpenMenu(false)} className="text-blue-600 hover:underline">About</Link> */}
        </nav>
      </div>
    </>
  );
}
