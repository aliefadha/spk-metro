const StatCard = ({ title, value, Icon, bgColor, iconColor }) => {
  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
          <p className="text-4xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
