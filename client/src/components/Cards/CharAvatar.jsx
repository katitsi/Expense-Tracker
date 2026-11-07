import { getInitials } from "../../utils/helper";

const CharAvatar = ({ fullname, width, height, style, color }) => {
  return (
    <div
      className={`${width || "w-12"} ${height || "h-12"} ${
        style || ""
      } flex items-center justify-center rounded-full bg-linear-to-br ${
        color || "from-primary-light to-primary-dark text-white"
      }  font-bold shadow-lg`}
    >
      {getInitials(fullname || "")}
    </div>
  );
};

export default CharAvatar;
