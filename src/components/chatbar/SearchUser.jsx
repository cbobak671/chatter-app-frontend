import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import LoadingSpinner from "./LoadingSpinner";
import UserProfile from "./UserProfile";
import { IoIosCloseCircleOutline } from "react-icons/io";
const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchUser = async () => {
    const URL = `${BACKEND_URL}/messages/search-user`;
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //   search: search,
          username: search,
        }),
      });
      const data = await response.json();
      console.log(data);
      setLoading(false);
      setSearchUser(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleSearchUser();
  }, [search]);

 

  return (
    <div className="fixed top-20 bottom-0 left-0 right-0 text-slate-500 bg-slate-700 bg-opacity-30 p-3 overflow-auto scroll-auto">
      <div className="w-full max-w-lg mx-auto mt-12 m-2">
        <div className="bg-white rounded h-10 overflow-hidden flex">
          <input
            type="text"
            placeholder="Search by username..."
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="h-9 w-9 flex justify-center items-center">
            <CiSearch size={25} />
          </div>
        </div>
        <div className="bg-white mt-2 w-full rounded p-3">
          {searchUser.length === 0 && (
            <p className="text-left text-slate-500">User Does Not Exist</p>
          )}
          {loading && (
            <p>
              <LoadingSpinner />
            </p>
          )}
          {searchUser.length !== 0 &&
            !loading &&
            searchUser.map((user, index) => {
              return (
                <UserProfile key={user._id} user={user} onClose={onClose} />
              );
            })}
        </div>
      </div>
      <div
        className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white"
        onClick={onClose}
      >
        <button>
          <IoIosCloseCircleOutline />
        </button>
      </div>
    </div>
  );
};
export default SearchUser;
