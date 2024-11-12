export function MemberCard({ image, name, role, date, variant = "default" }) {
  if (variant === "responsable") {
    return (
      <div className="relative group p-3">
        <div className="bg-gradient-to-b from-green-bk to-gray-700 rounded-lg p-4 text-center h-[220px] flex flex-col items-center justify-between">
          <div className="relative overflow-hidden rounded-full w-24 h-24 mx-auto border-4 border-white shadow-lg">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center text-white">
            <h3 className="font-bold text-sm mb-1">{name}</h3>
            <p className="text-xs text-emerald-200 mb-1">{role}</p>
            {date && <p className="text-[10px] text-gray-300">{date}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group p-2">
      <div className="relative overflow-hidden rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 border-2 border-white shadow-lg">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-xs mb-0.5 truncate">{name}</h3>
        <p className="text-[10px] text-gray-600 truncate">{role}</p>
      </div>
    </div>
  );
}
