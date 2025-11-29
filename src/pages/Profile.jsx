import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, Save, Check } from 'lucide-react';

const USERS_API = 'http://localhost:3000/users';

const Profile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [status, setStatus] = useState({ loading: false, error: '', success: '' });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: '' });

        if (passwords.new !== passwords.confirm) {
            setStatus({ loading: false, error: "Passwords don't match", success: '' });
            return;
        }

        if (passwords.new.length < 6) {
            setStatus({ loading: false, error: "Password must be at least 6 characters", success: '' });
            return;
        }

        try {
            const resp = await axios.patch(`${USERS_API}/${user.id}`, { password: passwords.new });
            // Update local storage if needed, though usually we don't store plain password there if we can avoid it, 
            // but for this mock app we might need to keep consistency if the object has it.
            // The current user object in localStorage might not have the password field, but let's update the user state.
            const updatedUser = { ...user, ...resp.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setStatus({ loading: false, error: '', success: 'Password updated successfully!' });
            setPasswords({ new: '', confirm: '' });
        } catch (err) {
            console.error("Error updating password:", err);
            setStatus({ loading: false, error: "Failed to update password. Try again.", success: '' });
        }
    };

    if (!user) return <div className="p-10 text-center">Please log in.</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-aqua to-purple-400">
                Profile Settings
            </h1>

            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-8 shadow-xl">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-aqua to-purple-600 flex items-center justify-center text-3xl font-bold text-black shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                </div>

                <div className="border-t border-white/10 my-8"></div>

                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Lock size={20} className="text-aqua" />
                    Change Password
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">New Password</label>
                        <input
                            type="password"
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:border-aqua focus:outline-none focus:ring-1 focus:ring-aqua transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:border-aqua focus:outline-none focus:ring-1 focus:ring-aqua transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {status.error && <p className="text-red-400 text-sm">{status.error}</p>}
                    {status.success && <p className="text-green-400 text-sm flex items-center gap-2"><Check size={16} /> {status.success}</p>}

                    <button
                        type="submit"
                        disabled={status.loading}
                        className="mt-4 px-6 py-3 bg-aqua text-black font-bold rounded-lg hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status.loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
// Force rebuild
