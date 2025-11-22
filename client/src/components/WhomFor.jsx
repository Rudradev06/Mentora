import { User, GraduationCap, Building } from "lucide-react";

const WhomFor = () => {
  return (
    <section className="py-16 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
          Who is it for?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
            <GraduationCap size={48} className="text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Educators</h3>
            <p className="text-gray-600">
              Easily create and distribute course content, manage student
              submissions, and analyze performance.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
            <User size={48} className="text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Students</h3>
            <p className="text-gray-600">
              Access all your course materials, submit assignments, and track
              your grades from a single dashboard.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
            <Building size={48} className="text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Organizations</h3>
            <p className="text-gray-600">
              Deliver scalable training programs, onboard new employees, and
              ensure compliance with ease.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhomFor;
