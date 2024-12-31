import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useFetchUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userArtworks, setUserArtworks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleSessionTimeout = () => {
        toast.error("Session has expired. Please sign in again.");
        setTimeout(() => {
            localStorage.removeItem("access_token");
            navigate("/");
        }, 3000);
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch("https://demo-project-backend-ude8.onrender.com/api/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                setFilteredUsers(data);
                setLoading(false);
            } else if (response.status === 401) {
                handleSessionTimeout();
            } else {
                toast.error("Failed to fetch users");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error while fetching users");
            setLoading(false);
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            const userResponse = await fetch(`https://demo-project-backend-ude8.onrender.com/api/users/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                setSelectedUser(userData);

                const artworkResponse = await fetch(`https://demo-project-backend-ude8.onrender.com/api/users/${userId}/artworks`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });

                if (artworkResponse.ok) {
                    const artworkData = await artworkResponse.json();
                    setUserArtworks(artworkData);
                } else if (artworkResponse.status === 401) {
                    handleSessionTimeout();
                } else {
                    toast.error("Failed to fetch user's artworks");
                }

                setShowModal(true);
            } else if (userResponse.status === 401) {
                handleSessionTimeout();
            } else {
                toast.error("Failed to fetch user details");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error while fetching user details");
        }
    };

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = users.filter(
            (user) =>
                user.username.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`https://demo-project-backend-ude8.onrender.com/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            if (response.ok) {
                setUsers(users.filter((user) => user.id !== userId));
                setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
                toast.success("User deleted successfully");
            } else if (response.status === 401) {
                handleSessionTimeout();
            } else {
                toast.error("Failed to delete user");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error while deleting user");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        filteredUsers,
        searchQuery,
        selectedUser,
        userArtworks,
        showModal,
        fetchUserDetails,
        handleSearchChange,
        handleDelete,
        setShowModal,
        loading,
    };
};

export default useFetchUsers;
