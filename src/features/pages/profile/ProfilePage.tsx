'use client'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../../components/context/AuthContext"

const ProfilePage: React.FC = () => {
       const [user, setUser] = useState<{ name: string; email: string; phone_number: string } | null>(null)
       const [loading, setLoading] = useState(true)
       const [editing, setEditing] = useState(false)
       const [form, setForm] = useState({ name: '', email: '', phone_number: '' })
       const [message, setMessage] = useState<string | null>(null)
       const [error, setError] = useState<string | null>(null)
       const [saving, setSaving] = useState(false)
       const navigate = useNavigate()
       const { logout } = useAuth()

       const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
       const [currentPassword, setCurrentPassword] = useState('');
       const [newPassword, setNewPassword] = useState('');
       const [confirmNewPassword, setConfirmNewPassword] = useState('');
       const [passwordError, setPasswordError] = useState<string | null>(null);
       const [passwordSaving, setPasswordSaving] = useState(false);
       const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

       const [showDeleteModal, setShowDeleteModal] = useState(false)
       const [deletePassword, setDeletePassword] = useState('')
       const [confirmDeletePassword, setConfirmDeletePassword] = useState('')
       const [deleteError, setDeleteError] = useState<string | null>(null)
       const [deleting, setDeleting] = useState(false)

       // Phone validation function
       const validatePhoneNumber = (phone: string): string | null => {
            const allowedCharsRegex = /^[\d\s\-()+]*$/;
            const digitsOnly = phone.replace(/\D/g, ""); // remove non-digit chars
        
            if (!allowedCharsRegex.test(phone)) {
                return "Phone number contains invalid characters.";
            }
            if (digitsOnly.length < 7) {
                return "Phone number is too short.";
            }
            if (digitsOnly.length > 15) {
                return "Phone number is too long.";
            }
            return null; // valid
        };
      

       // Reusable fetch session function
       const fetchSession = async () => {
              try {
                     const res = await fetch('http://18.138.130.229:3000/api/users/session', { credentials: 'include' })
                     const data = await res.json()
                     if (data.success) {
                            setUser({ name: data.data.name, email: data.data.email, phone_number: data.data.phone_number || '' })
                            setForm({ name: data.data.name, email: data.data.email, phone_number: data.data.phone_number || '' })
                            setLoading(false)
                     } else {
                            setUser(null)
                            setLoading(false)
                            navigate('/login')
                     }
              } catch (err) {
                     console.error('Failed to fetch session:', err)
                     setUser(null)
                     setLoading(false)
                     navigate('/login')
              }
       }

       useEffect(() => {
              fetchSession()
       }, [navigate])

       const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              const { name, value } = e.target

              setForm(prev => ({ ...prev, [name]: value }))

              if (name === "phone_number") {
                const validationError = validatePhoneNumber(value.trim());
                setError(validationError);
              }
       }

       const handleEdit = () => {
              setEditing(true)
              setMessage(null)
              setError(null)
       }

       const handleCancel = () => {
              if (user) setForm({ name: user.name, email: user.email, phone_number: user.phone_number })
              setEditing(false)
              setMessage(null)
              setError(null)
       }

       const handleSave = async () => {
              // Prevent save if phone number invalid
                if (error) return
                const validationError = validatePhoneNumber(form.phone_number.trim());
                if (validationError) {
                    setError(validationError);
                    return;
                }

              setSaving(true)
              setMessage(null)
              setError(null)
              try {
                    const res = await fetch('http://localhost:3000/api/users/profile', {
                     const res = await fetch('http://18.138.130.229:3000/api/users/profile', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify(form),
                     })
                     const data = await res.json()
                     if (data.success) {
                            setUser({ ...form })
                            setEditing(false)
                            setMessage('Profile updated successfully!')
                     } else {
                            setError(data.message || 'Failed to update profile.')
                     }
              } catch (err) {
                     setError('Network error. Please try again.')
              } finally {
                     setSaving(false)
              }
       }

       const handleChangePassword = async () => {
            setPasswordError(null);
            setPasswordSuccess(null);
        
            if (!currentPassword || !newPassword || !confirmNewPassword) {
                setPasswordError("Please fill in all fields.");
                return;
            }
        
            if (newPassword !== confirmNewPassword) {
                setPasswordError("New password and confirmation do not match.");
                return;
            }
        
            setPasswordSaving(true);
        
            try {
            const res = await fetch('http://localhost:3000/api/users/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ currentPassword, newPassword }),
            });
        
            const data = await res.json();
        
            if (data.success) {
                setPasswordSuccess("Password changed successfully!");
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setTimeout(() => {
                setShowChangePasswordModal(false);
                setPasswordSuccess(null);
                }, 2000);
            } else {
                setPasswordError(data.message || "Failed to change password.");
            }
            } catch (err) {
                setPasswordError("Network error. Please try again.");
            } finally {
                setPasswordSaving(false);
            }
      };
      

       const handleLogout = async () => {
              try {
                     await fetch('http://18.138.130.229:3000/api/users/logout', {
                            method: 'POST',
                            credentials: 'include',
                     })
              } catch (err) {
                     console.error('Logout error:', err)
              }
              await logout()
              setUser(null)
              navigate('/login')
       }

       const handleDeleteAccount = async () => {
              setDeleteError(null)
              if (deletePassword !== confirmDeletePassword) {
                     setDeleteError('Passwords do not match.')
                     return
              }
              if (!deletePassword || !confirmDeletePassword) {
                     setDeleteError('Please enter both password fields.')
                     return
              }

              setDeleting(true)
              try {
                     const res = await fetch('http://18.138.130.229:3000/api/users/delete', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ password: deletePassword }),
                     })
                     const data = await res.json()
                     if (data.success) {
                            setUser(null)
                            navigate('/login')
                     } else {
                            setDeleteError(data.message || 'Failed to delete account.')
                     }
              } catch (err) {
                     setDeleteError('Network error. Please try again.')
              } finally {
                     setDeleting(false)
              }
       }

       if (loading) return <div className="p-8">Loading...</div>
       if (!user) return null

       return (
              <>
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
                                                                                    className={`border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 text-gray-900 ${
                                                                                           editing ? 'bg-white' : 'bg-gray-100'
                                                                                    }`}
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
                                                                                    className={`border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 text-gray-900 ${
                                                                                           editing ? 'bg-white' : 'bg-gray-100'
                                                                                    }`}
                                                                             />
                                                                      ) : (
                                                                             <div className="text-lg text-gray-900 border-b pb-2">{user.email}</div>
                                                                      )}
                                                               </div>
                                                               <div>
                                                                      <label className="text-variant1 font-semibold mb-1 block">Phone Number</label>
                                                                      {editing ? (
                                                                             <>
                                                                                    <input
                                                                                           type="text"
                                                                                           name="phone_number"
                                                                                           value={form.phone_number}
                                                                                           onChange={handleChange}
                                                                                           disabled={!editing}
                                                                                           className={`border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 text-gray-900 ${
                                                                                                  editing ? 'bg-white' : 'bg-gray-100'
                                                                                           }`}
                                                                                    />
                                                                                    {error && (
                                                                                           <p className="text-red-600 mt-1 text-sm">{error}</p>
                                                                                    )}
                                                                             </>
                                                                      ) : (
                                                                             <div className="text-lg text-gray-900 border-b pb-2 min-h-[2.5rem] flex items-center justify-center">
                                                                                    {user.phone_number ? user.phone_number : <span className="text-gray-400">No phone number</span>}
                                                                             </div>
                                                                      )}
                                                               </div>
                                                        </div>
                                                        {message && <div className="text-green-600 text-center mb-2">{message}</div>}
                                                        {error && !editing && <div className="text-red-500 text-center mb-2">{error}</div>}
                                                        <div className="flex justify-center mt-4">
                                                            <button
                                                                className="button-main w-full text-center mt-4"
                                                                onClick={() => {
                                                                setShowChangePasswordModal(true);
                                                                setPasswordError(null);
                                                                setPasswordSuccess(null);
                                                                setCurrentPassword('');
                                                                setNewPassword('');
                                                                setConfirmNewPassword('');
                                                                }}
                                                            >
                                                                Change Password
                                                            </button>
                                                        </div>

                                                        <div className="flex gap-4 mt-6 justify-center">
                                                               {editing ? (
                                                                      <>
                                                                             <button className="button-main w-full text-center" onClick={handleSave} disabled={saving}>
                                                                                    {saving ? 'Saving...' : 'Save'}
                                                                             </button>
                                                                             <button className="button-main w-full text-center" onClick={handleCancel} disabled={saving}>
                                                                                    Cancel
                                                                             </button>
                                                                      </>
                                                               ) : (
                                                                      <button className="button-main w-full text-center" onClick={handleEdit}>
                                                                             Edit
                                                                      </button>
                                                               )}
                                                        </div>
                                                        <div className="flex justify-center mt-4">
                                                               <button className="button-main w-full text-center mt-4" onClick={handleLogout}>
                                                                      Logout
                                                               </button>
                                                        </div>
                                                        <div className="flex justify-center mt-4">
                                                               <button className="button-main w-full text-center mt-4" onClick={() => setShowDeleteModal(true)}>
                                                                      Delete Account
                                                               </button>
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </div>

                     {showChangePasswordModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-semibold mb-4">Change Password</h2>

                            <input
                                type="password"
                                placeholder="Current password"
                                className="w-full bg-gray-300 px-4 py-2 border border-gray-300 rounded mb-3"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder="New password"
                                className="w-full bg-gray-300 px-4 py-2 border border-gray-300 rounded mb-3"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder="Confirm new password"
                                className="w-full bg-gray-300 px-4 py-2 border border-gray-300 rounded mb-3"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />

                            {passwordError && <p className="text-red-600 mb-3">{passwordError}</p>}
                            {passwordSuccess && <p className="text-green-600 mb-3">{passwordSuccess}</p>}

                            <div className="flex justify-between gap-4">
                                <button
                                className="w-full bg-gray-300 text-gray-800 py-2 rounded"
                                onClick={() => {
                                    setShowChangePasswordModal(false);
                                    setPasswordError(null);
                                    setPasswordSuccess(null);
                                }}
                                disabled={passwordSaving}
                                >
                                Cancel
                                </button>

                                <button
                                className="w-full bg-blue-600 text-white py-2 rounded"
                                onClick={handleChangePassword}
                                disabled={passwordSaving}
                                >
                                {passwordSaving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                            </div>
                        </div>
                        )}
                                          

                     {showDeleteModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                   <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                          <h2 className="text-xl font-semibold mb-4">Confirm Account Deletion</h2>
                                          <p className="mb-4 text-sm text-gray-700">
                                                 Are you sure you want to delete your account? This action is irreversible.
                                          </p>
                                          <div className="space-y-4">
                                                 <input
                                                        type="password"
                                                        placeholder="Enter password"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-gray-900"
                                                        value={deletePassword}
                                                        onChange={(e) => setDeletePassword(e.target.value)}
                                                 />
                                                 <input
                                                        type="password"
                                                        placeholder="Confirm password"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-gray-900"
                                                        value={confirmDeletePassword}
                                                        onChange={(e) => setConfirmDeletePassword(e.target.value)}
                                                 />
                                                 {deleteError && <div className="text-red-500 text-sm">{deleteError}</div>}
                                                 <div className="flex justify-between gap-4 mt-4">
                                                        <button
                                                               className="w-full bg-gray-300 text-gray-800 py-2 rounded"
                                                               onClick={() => {
                                                                      setShowDeleteModal(false)
                                                                      setDeletePassword('')
                                                                      setConfirmDeletePassword('')
                                                                      setDeleteError(null)
                                                               }}
                                                               disabled={deleting}
                                                        >
                                                               Cancel
                                                        </button>
                                                        <button className="w-full bg-red-700 text-white py-2 rounded" onClick={handleDeleteAccount} disabled={deleting}>
                                                               {deleting ? 'Deleting...' : 'Delete'}
                                                        </button>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     )}
              </>
       )
}

export default ProfilePage
