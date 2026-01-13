import { useNavigate } from 'react-router-dom';

export default function LoginOptions() {
  const navigate = useNavigate();
  return (
    <section className="flex justify-center gap-6 py-8 bg-white">
      <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-3 rounded-lg">Student Login</button>
      <button onClick={() => navigate('/login')} className="bg-green-600 text-white px-6 py-3 rounded-lg">Teacher Login</button>
      <button onClick={() => navigate('/login')} className="bg-red-600 text-white px-6 py-3 rounded-lg">Owner Login</button>
    </section>
  );
}
