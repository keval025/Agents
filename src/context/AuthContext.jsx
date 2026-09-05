import React, { createContext, useContext, useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';

const AuthContext = createContext({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch custom DB profile record
  const fetchDbProfile = async (userId) => {
    if (!userId) return null;
    try {
      const { data, error } = await insforge.database
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
        return data;
      }

      // If no DB profile exists, attempt fetch via auth.getProfile()
      const { data: authProf } = await insforge.auth.getProfile(userId);
      if (authProf) {
        setProfile(authProf);
        return authProf;
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
    return null;
  };

  // Helper to ensure profile row exists in DB
  const ensureProfileInDb = async (userObj, extraName = '') => {
    if (!userObj || !userObj.id) return;
    const displayName = extraName || userObj.profile?.name || userObj.email?.split('@')[0] || 'User';

    const { data: existing } = await insforge.database
      .from('profiles')
      .select('id')
      .eq('id', userObj.id)
      .maybeSingle();

    if (!existing) {
      await insforge.database
        .from('profiles')
        .insert([{
          id: userObj.id,
          full_name: displayName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
    }
    await fetchDbProfile(userObj.id);
  };

  // Check initial session
  useEffect(() => {
    let isMounted = true;
    async function initAuth() {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (isMounted) {
          if (data && data.user) {
            setUser(data.user);
            setSession(data.user.accessToken || true);
            await ensureProfileInDb(data.user);
          } else {
            setUser(null);
            setProfile(null);
            setSession(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initAuth();
    return () => { isMounted = false; };
  }, []);

  // Sign Up
  const signUp = async ({ email, password, name }) => {
    const { data, error } = await insforge.auth.signUp({
      email,
      password,
      name,
    });

    if (error) {
      const formattedErr = new Error(error.nextActions || error.message || error.error || 'Registration failed.');
      formattedErr.raw = error;
      throw formattedErr;
    }

    if (data && data.user) {
      setUser(data.user);
      if (data.accessToken) {
        setSession(data.accessToken);
      }
      // Ensure custom DB profile table row is created
      await ensureProfileInDb(data.user, name);
    }
    return data;
  };

  // Sign In
  const signIn = async ({ email, password }) => {
    const { data, error } = await insforge.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const formattedErr = new Error(error.nextActions || error.message || error.error || 'Authentication failed.');
      formattedErr.raw = error;
      throw formattedErr;
    }

    if (data && data.user) {
      setUser(data.user);
      setSession(data.accessToken);
      await ensureProfileInDb(data.user);
    }
    return data;
  };

  // Sign Out
  const signOut = async () => {
    const { error } = await insforge.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  // Update Profile
  const updateProfile = async (fields) => {
    if (!user) return;

    // Update in auth profile
    await insforge.auth.setProfile(fields);

    // Update in DB profiles table
    const { data, error } = await insforge.database
      .from('profiles')
      .update({
        ...fields,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select();

    if (!error && data && data.length > 0) {
      setProfile(data[0]);
    } else {
      setProfile(prev => ({ ...prev, ...fields }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
