'use client'

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderOne from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<{ name: string; email: string; phone_number: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone_number: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch('http://localhost:3000/api/users/session', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setUser({ name: data.data.name, email: data.data.email, phone_number: data.data.phone_number || '' });
        setForm({ name: data.data.name, email: data.data.email, phone_number: data.data.phone_number || '' });
        console.log(data);
      } else {
        console.log("Failed to fetch user data");
        navigate('/login');
      }
      setLoading(false);
    };
    fetchSession();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditing(true);
    setMessage(null);
    setError(null);
  };

  const handleCancel = () => {
    if (user) setForm({ name: user.name, email: user.email, phone_number: user.phone_number });
    setEditing(false);
    setMessage(null);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setUser(form);
        setEditing(false);
        setMessage('Profile updated successfully!');
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return null;

  return (
    <>
      <HeaderOne />
      <div className="login-us lg:py-20 md:py-14 py-10 bg-gray-100 min-h-[60vh]">
        <div className="container">
          <div className="content flex items-center justify-center">
            <div id="form-profile" className="xl:basis-1/3 lg:basis-1/2 sm:basis-2/3 max-sm:w-full">
              <div className="heading3 text-center mb-2">Profile</div>
              <div className="md:mt-10 mt-6">
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="text-variant1 font-semibold mb-1 block">Name</label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={!editing}
                        className={`border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 text-gray-900 ${editing ? 'bg-white' : 'bg-gray-100'}`}
                      />
                    ) : (
                      <div className="text-lg text-gray-900 border-b pb-2">{user.name}</div>
                    )}
                  </div>
                  <div>
                    <label className="text-variant1 font-semibold mb-1 block">Email</label>
                    {editing ? (
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        disabled
                        className={`border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 text-gray-900 ${editing ? 'bg-white' : 'bg-gray-100'}`}
                      />
                    ) : (
                      <div className="text-lg text-gray-900 border-b pb-2">{user.email}</div>
                    )}
                  </div>
                  <div>
                    <label className="text-variant1 font-semibold mb-1 block">Phone Number</label>
                    {editing ? (
                      <input
                        type="text"
                        name="phone_number"
                        value={form.phone_number}
                        onChange={handleChange}
                        disabled={!editing}
                        className={`border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 text-gray-900 ${editing ? 'bg-white' : 'bg-gray-100'}`}
                      />
                    ) : (
                      <div className="text-lg text-gray-900 border-b pb-2 min-h-[2.5rem] flex items-center justify-center">
                        {user.phone_number ? user.phone_number : <span className="text-gray-400">No phone number</span>}
                      </div>
                    )}
                  </div>
                </div>
                {message && <div className="text-green-600 text-center mb-2">{message}</div>}
                {error && <div className="text-red-500 text-center mb-2">{error}</div>}
                <div className="flex gap-4 mt-6 justify-center">
                  {editing ? (
                    <>
                      <button
                        className="button-main w-full text-center"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        className="button-main w-full text-center"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="button-main w-full text-center"
                      onClick={handleEdit}
                    >
                      Edit
                    </button>
                  )}
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    className="button-main w-full text-center mt-4"
                    onClick={async () => {
                      await fetch('http://localhost:3000/api/users/logout', {
                        method: 'POST',
                        credentials: 'include',
                      });
                      navigate('/login');
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import HeaderOne from '../../components/Header/Header';
// import Footer from '../../components/Footer/Footer';

// const ProfilePage: React.FC = () => {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       // 1. Get session to find user ID
//       const sessionRes = await fetch('http://localhost:3000/api/users/session', { credentials: 'include' });
//       const sessionData = await sessionRes.json();
//       if (!sessionData.success || !sessionData.data?.id) {
//         navigate('/login');
//         return;
//       }
//       const userId = sessionData.data.id;

//       // 2. Get user details by ID
//       const userRes = await fetch(`http://localhost:3000/api/users/${userId}`, { credentials: 'include' });
//       const userData = await userRes.json();
//       if (userData.success && userData.data && userData.data.length > 0) {
//         setUser(userData.data[0]);
//       }
//       setLoading(false);
//     };
//     fetchUser();
//   }, [navigate]);

//   // if (loading) return <div className="p-8">Loading...</div>;
//   // if (!user) return null;

//   return (
//     <>
//       <HeaderOne />
//       <div className="login-us lg:py-20 md:py-14 py-10 bg-gray-100 min-h-[60vh]">
//         <div className="container">
//           <div className="content flex items-center justify-center">
//             <div id="form-profile" className="xl:basis-1/3 lg:basis-1/2 sm:basis-2/3 max-sm:w-full">
//               <div className="heading3 text-center mb-2">Profile</div>
//               <div className="md:mt-10 mt-6">
//                 <div className="mb-6 space-y-4">
//                   <div>
//                     <label className="text-variant1 font-semibold mb-1 block">Name</label>
//                     <div className="text-lg text-gray-900 border-b pb-2">{user.name}</div>
//                   </div>
//                   <div>
//                     <label className="text-variant1 font-semibold mb-1 block">Email</label>
//                     <div className="text-lg text-gray-900 border-b pb-2">{user.email}</div>
//                   </div>
//                   <div>
//                     <label className="text-variant1 font-semibold mb-1 block">Phone Number</label>
//                     <div className="text-lg text-gray-900 border-b pb-2 min-h-[2.5rem] flex items-center justify-center">
//                       {user.phone_number ? user.phone_number : <span className="text-gray-400">No phone number</span>}
//                     </div>
//                   </div>
//                 </div>
//                 {/* ...edit, logout, etc. buttons here... */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ProfilePage;