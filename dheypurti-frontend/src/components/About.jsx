export default function About() {
  return (
    <section className="flex flex-col md:flex-row items-center py-16 px-8 bg-gray-50 gap-12">
      {/* Left side: Founder image */}
      <div className="md:w-1/2">
        <img 
          src="/images/founder.jpg" 
          alt="Founder" 
          className="w-full rounded-lg shadow-xl object-cover max-h-[500px]" 
        />
      </div>

      {/* Right side: About content */}
      <div className="md:w-1/2 space-y-4 max-w-md">
        <h2 className="text-gray-800 mb-2">
          <span className="text-xl md:text-2xl font-medium block">Welcome to</span>
          <span className="text-3xl md:text-4xl font-bold text-blue-600 block">Dheypurti Academy</span>
        </h2>

      <p className="text-base md:text-lg text-gray-700">
  Founded in 2025 in Shrigonda, Dheypurti Academy has become a hub of excellence for aspiring police officers. What began as a small initiative is now a thriving community empowering students to succeed.
</p>

<p className="text-base md:text-lg text-gray-700">
  Our teaching combines rigorous training, real-world strategies, and personalized mentorship, ensuring students grasp concepts and develop problem-solving skills effectively.
</p>

<p className="text-base md:text-lg text-gray-700">
  More than a coaching center, Dheypurti Academy inspires determination and opportunity, guiding students toward achieving their highest potential.
</p>

<p className="text-base md:text-lg font-semibold text-gray-800">
  Your journey starts here. Success is just a batch away!
</p>

      </div>
    </section>
  );
}
