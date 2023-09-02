import React, { useState, useEffect } from 'react';
import axios from 'axios';
import router from 'next/router';

export default function EditUserForm({ user, onSave }) {
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:50000/edit-user/${editedUser.id}`, editedUser);
      onSave(response.data); // Send updated user data back to the parent component
      router.push('/');
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <div>
      <form>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="textbox"
            id="firstName"
            name="firstName"
            value={editedUser.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="middlename">Middle Name:</label>
          <input
            type="text"
            id="Middle"
            name="middle"
            value={editedUser.middleName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={editedUser.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={editedUser.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="address">Adress:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={editedUser.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
       
        
        <button type="button" onClick={handleSave} className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'>
          Save
        </button>
      </form>
    </div>
  );
}
