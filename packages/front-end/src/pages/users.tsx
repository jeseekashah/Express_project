import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import EditUserForm from './EditUserForm';

export default function UsersList() {
  const [flag, setFlag] = useState(1);
  const [flagV, setFlagV] = useState(1);
  const [flagE, setFlagE] = useState(1);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userKey, setUserKey] = useState(0);
  const [show, setShow] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [sortColumn, setSortColumn] = useState('email'); // Initial column to sort by
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://localhost:50000/users')
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.error('Failed to fetch users:', error);
      });
  }, []);

  const handleDelete = async (userId) => {
    try {
      console.log('Delete button clicked for user ID:', userId);
      await axios.delete(`http://localhost:50000/delete-user/${userId}`);
      // Refresh the list of users after deletion
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleView = async (userId) => {
    try {
      console.log('View button clicked for user ID:', userId);
      await axios.get(`http://localhost:50000/get-user/${userId}`);
      setFlagV(0);
      setFlag(0);
      // Refresh the list of users after deletion
      const updatedUsers = users.filter((user) => user.id == userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to view user:', error);
    }
  };

  const handleEdit = (user, id) => {
    setEditingUser(user); // Set the user to edit
    setUserKey(id);
    setFlagE(0);
    setFlag(0);
    setShow(0);
  };

  const handleSaveEdit = async (updatedUser) => {
    try {
      console.log('Edit button clicked for user ID:', updatedUser.id);
      await axios.put(`http://localhost:50000/edit-user/${updatedUser.id}`, updatedUser);
      // Refresh the list of users after edit
      const updatedUsers = users.map((user) => {
        if (user.id === updatedUser.id) {
          return updatedUser;
        }
        return user;
      });
      setUsers(updatedUsers);

      // Reset the edit flags and editingUser state
      setFlagE(1);
      setFlag(1);
      setEditingUser(null); // Clear editingUser
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleSort = (column) => {
    // Toggle sorting order if the same column is clicked again
    const newSortOrder = column === sortColumn && sortOrder === 'asc' ? 'desc' : 'asc';

    // Sort the users array based on the selected column and order
    const sortedUsers = [...users].sort((a, b) => {
      if (newSortOrder === 'asc') {
        return a[column].localeCompare(b[column]);
      } else {
        return b[column].localeCompare(a[column]);
      }
    });

    // Update the sorted users and sorting state
    setUsers(sortedUsers);
    setSortOrder(newSortOrder);
    setSortColumn(column);
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='max-w-4xl mx-auto'>
      {show === 1 ? (
        <>
          <h1 className='text-2xl font-semibold mb-4'>List of Users</h1>
          <div className='mb-4'>
            <input
              type='text'
              placeholder='Search by Email'
              className='p-2 border border-neutral-300'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <table className='w-full border-collapse border border-neutral-300'>
            <thead className='bg-gray-100'>
              {flag === 1 && editingUser === null ? (
                <tr>
                  <th
                    className='p-2 border border-neutral-300'
                    onClick={() => handleSort('email')}
                  >
                    Email {sortColumn === 'email' && (
                      <span className='ml-1'>
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th className='p-2 border border-neutral-300'>Registered</th>
                  <th
                    className='p-2 border border-neutral-300'
                    onClick={() => handleSort('firstName')}
                  >
                    Name {sortColumn === 'firstName' && (
                      <span className='ml-1'>
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  {flagE === 1 || flag === 1 ? (
                    <>
                      <th className='p-2 border border-neutral-300'>Edit</th>
                      <th className='p-2 border border-neutral-300'>Delete</th>
                      <th className='p-2 border border-neutral-300'>View</th>
                    </>
                  ) : (
                    <></>
                  )}
                </tr>
              ) : (
                <tr>
                  <th className='p-2 border border-neutral-300'>Email</th>
                  <th className='p-2 border border-neutral-300'>Registered</th>
                  <th className='p-2 border border-neutral-300'>First Name</th>
                  <th className='p-2 border border-neutral-300'>Middle Name</th>
                  <th className='p-2 border border-neutral-300'>Last Name</th>
                  <th className='p-2 border border-neutral-300'>Phone Number</th>
                  <th className='p-2 border border-neutral-300'>Address</th>
                  <th className='p-2 border border-neutral-300'>Admin Note</th>
                </tr>
              )}
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className='p-2 border border-neutral-300'>{user.email}</td>
                  <td className='p-2 border border-neutral-300'>
                    {new Date(user.registered).toLocaleDateString()}
                  </td>
                  {flag === 1 ? (
                    <>
                      <td className='p-2 border border-neutral-300'>
                        {user.firstName} {user.lastName}
                      </td>
                      <td className='p-2 border border-neutral-300'>
                        <button
                          className='text-blue-500 hover:underline'
                          onClick={() => handleEdit(user, user.id)}
                        >
                          Edit
                        </button>
                      </td>
                      <td className='p-2 border border-neutral-300'>
                        <button
                          className='text-red-500 hover:underline'
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                      <td className='p-2 border border-neutral-300'>
                        <button
                          className='text-green-500 hover:underline'
                          onClick={() => handleView(user.id)}
                        >
                          View
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className='p-2 border border-neutral-300'>{user.firstName}</td>
                      <td className='p-2 border border-neutral-300'>{user.middleName}</td>
                      <td className='p-2 border border-neutral-300'>{user.lastName}</td>
                      <td className='p-2 border border-neutral-300'>{user.phoneNumber}</td>
                      <td className='p-2 border border-neutral-300'>{user.address}</td>
                      <td className='p-2 border border-neutral-300'>{user.adminNote}</td>
                    </>
                  )}
                  {flagV === 0 ? (
                    <div className='p-4'>
                      <Link href='http://localhost:3000/'>
                        <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'>
                          Home
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <></>
                  )}
                  {flagE === 0 && editingUser && (
                    <div className='p-4'>
                      <button
                        className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'
                        onClick={() => handleSaveEdit(editingUser.id)}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <h1 className='text-2xl font-semibold mb-4'>Edit Users</h1>
      )}
      {editingUser && flagE === 0 && (
        <EditUserForm user={editingUser} onSave={handleSaveEdit} />
      )}
    </div>
  );
}
