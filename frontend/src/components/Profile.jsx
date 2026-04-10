import React, { useEffect, useState } from 'react';
import axios from 'axios';
const Profile = () => {
    const [user, setUser] = React.useState({
        name: "",
        email: "",
        address: "",
        password: ""
    });
    const [edit, setEdit] = useState(false);
    const fetchUser = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/users/profile", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                },
            });
            if (response.data.success) {
                setUser({
                    name: response.data.user.name,
                    email: response.data.user.email,
                    address: response.data.user.address,

                }

                );


            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            alert("Error fetching user profile. Please try again.");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.put("http://localhost:3000/api/users/profile", user, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
      },
    });
    if (response.data.success) {
      alert("Profile updated successfully");
      setEdit(false);
    } else {
      alert("Failed to update profile");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Error updating profile. Please try again.");
  }
};
    return (
        <div className="p-5">
            <form className="bg-white p-6 rounded-lg shadow max-w-md" onSubmit={handleSubmit}>
                <h2 className="font-bold text-2xl">User Profile</h2>
                <div className="mb-4 mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        disabled={!edit}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        disabled={!edit}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={user.address}
                        onChange={(e) => setUser({ ...user, address: e.target.value })}
                        disabled={!edit}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {edit && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder='enter the password (optional)'
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-50"
                        />
                    </div>
                )}

                {!edit ? (
                    <button
                        type="button"
                        onClick={() => setEdit(!edit)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 cursor-pointer"
                    >
                        Edit Profile
                    </button>
                ) : (
                    <>
                        <button
                            type="submit"
                            
                            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 cursor-pointer"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => setEdit(!edit)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 ml-2 cursor-pointer"
                        >
                            Cancel
                        </button>
                    </>
                )}
            </form>
        </div>

    );
};
export default Profile;