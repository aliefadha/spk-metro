import user from "@/assets/ilustrations/user.png"
const WelcomeSection = ({ userName, role }) => {
  return (
    <div className="bg-white rounded-2xl p-8 flex justify-between items-center mb-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-gray-600 mb-2">Hi, {userName} ({role})</h2>
          <h1 className="text-3xl font-bold">Selamat Datang di MetroWise</h1>
        </div>
        <p className="text-gray-500 max-w-xl">
          Streamline your decision-making process and choose 
          the right leader based on key performance indicators!
        </p>
      </div>
      <img 
        src={user} 
        alt="Welcome illustration" 
        className="hidden md:block w-80 h-auto"
      />
    </div>
  );
};

export default WelcomeSection