import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './use-toast';

// Types pour les utilisateurs basés sur la table profiles
export interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  organization: string | null;
  avatar_url: string | null;
  roles: string[];
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  twitter: string | null;
  bio: string | null;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Données calculées
  full_name?: string;
  is_admin?: boolean;
  last_login?: string;
}

export interface CreateUserInput {
  first_name: string;
  last_name: string;
  email: string;
  organization?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  twitter?: string;
  bio?: string;
  roles: string[];
  generate_password?: boolean;
  custom_password?: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  id: string;
}

export interface UserStats {
  total: number;
  admins: number;
  editors: number;
  users: number;
  active_today: number;
  new_this_month: number;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Charger tous les utilisateurs
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enrichir les données utilisateur
      const enrichedUsers: User[] = (data || []).map(user => ({
        ...user,
        full_name: user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name}` 
          : user.first_name || user.last_name || 'Utilisateur',
        is_admin: user.roles?.includes('admin') || false,
        roles: user.roles || ['user']
      }));

      setUsers(enrichedUsers);
    } catch (err: any) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Créer un nouvel utilisateur via Edge Function
  const createUser = useCallback(async (userData: CreateUserInput): Promise<{ user: User; password?: string } | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Non authentifié');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
      const response = await fetch(`${supabaseUrl}/functions/v1/create-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          generate_password: userData.generate_password ?? true,
          password: userData.custom_password, // Envoyer le mot de passe personnalisé si fourni
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création');
      }

      const result = await response.json();
      
      const newUser: User = {
        ...result.user,
        full_name: `${result.user.first_name} ${result.user.last_name}`,
        is_admin: result.user.roles?.includes('admin') || false,
        roles: result.user.roles || ['user']
      };

      setUsers(prev => [newUser, ...prev]);
      
      toast({
        title: "Succès",
        description: result.generated_password 
          ? "Utilisateur créé avec mot de passe généré"
          : "Utilisateur créé avec succès",
      });

      return {
        user: newUser,
        password: result.generated_password
      };
    } catch (err: any) {
      console.error('Erreur lors de la création:', err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible de créer l'utilisateur",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Mettre à jour un utilisateur
  const updateUser = useCallback(async (userData: UpdateUserInput): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          organization: userData.organization,
          phone: userData.phone,
          location: userData.location,
          linkedin: userData.linkedin,
          twitter: userData.twitter,
          bio: userData.bio,
          roles: userData.roles,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userData.id)
        .select()
        .single();

      if (error) throw error;

      const updatedUser: User = {
        ...data,
        full_name: `${data.first_name} ${data.last_name}`,
        is_admin: data.roles?.includes('admin') || false,
        roles: data.roles || ['user']
      };

      setUsers(prev => prev.map(user => 
        user.id === userData.id ? updatedUser : user
      ));

      toast({
        title: "Succès",
        description: "Utilisateur mis à jour avec succès",
      });

      return updatedUser;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible de mettre à jour l'utilisateur",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Supprimer un utilisateur
  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== userId));

      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      });

      return true;
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible de supprimer l'utilisateur",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Mettre à jour les rôles d'un utilisateur
  const updateUserRoles = useCallback(async (userId: string, roles: string[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          roles,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, roles, is_admin: roles.includes('admin') }
          : user
      ));

      toast({
        title: "Succès",
        description: "Rôles mis à jour avec succès",
      });

      return true;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour des rôles:', err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible de mettre à jour les rôles",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Statistiques des utilisateurs
  const getUserStats = useCallback((): UserStats => {
    const total = users.length;
    const admins = users.filter(u => u.roles.includes('admin')).length;
    const editors = users.filter(u => u.roles.includes('editor')).length;
    const regularUsers = users.filter(u => u.roles.includes('user') && !u.roles.includes('admin') && !u.roles.includes('editor')).length;
    
    // Calculs approximatifs pour les stats temporelles
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const new_this_month = users.filter(u => 
      new Date(u.created_at) >= monthStart
    ).length;

    return {
      total,
      admins,
      editors,
      users: regularUsers,
      active_today: 0, // À implémenter avec une table de sessions
      new_this_month
    };
  }, [users]);

  // Filtrer les utilisateurs
  const filterUsers = useCallback((filters: {
    search?: string;
    role?: string;
    organization?: string;
  }) => {
    return users.filter(user => {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesSearch = 
          user.full_name?.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.organization?.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      if (filters.role && !user.roles.includes(filters.role)) {
        return false;
      }

      if (filters.organization && user.organization !== filters.organization) {
        return false;
      }

      return true;
    });
  }, [users]);

  // Obtenir les rôles disponibles
  const getAvailableRoles = useCallback(() => {
    return [
      { value: 'user', label: 'Utilisateur', description: 'Accès de base à la plateforme' },
      { value: 'editor', label: 'Éditeur', description: 'Peut créer et modifier du contenu' },
      { value: 'moderator', label: 'Modérateur', description: 'Peut modérer les commentaires et contenus' },
      { value: 'admin', label: 'Administrateur', description: 'Accès complet à toutes les fonctionnalités' }
    ];
  }, []);

  // Obtenir les organisations uniques
  const getOrganizations = useCallback(() => {
    const orgs = users
      .map(u => u.organization)
      .filter((org, index, arr) => org && arr.indexOf(org) === index)
      .sort();
    return orgs;
  }, [users]);

  // Charger les données au montage
  // Réinitialiser le mot de passe d'un utilisateur
  const resetUserPassword = useCallback(async (userId: string): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Non authentifié');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
      const response = await fetch(`${supabaseUrl}/functions/v1/reset-user-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la réinitialisation');
      }

      const result = await response.json();
      
      toast({
        title: "Succès",
        description: "Mot de passe réinitialisé avec succès",
      });

      return result.new_password;
    } catch (err: any) {
      console.error('Erreur lors de la réinitialisation:', err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible de réinitialiser le mot de passe",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserRoles,
    resetUserPassword,
    getUserStats,
    filterUsers,
    getAvailableRoles,
    getOrganizations,
  };
}
