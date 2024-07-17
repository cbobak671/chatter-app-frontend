import React from "react";
import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar";

const UserProfile = ({ user, onClose }) => {
  return (

    <Link
      to={"/messages/users" + user?._id}
      onClick={onClose}
      className="flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-300 hover:border hover:border-purple-400 hover:bg-purple-100 rounded cursor-pointer"
    >
      <div>
        <UserAvatar
          width={50}
          height={50}
          name={user?.username}
          userId={user?._id}
        />
      </div>
      <div className="font-semibold text-ellipsis line-clamp-1">
        {user?.username}
      </div>
    </Link>

  );
};

export default UserProfile;
