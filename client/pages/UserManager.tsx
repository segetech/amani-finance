import React, { useState, useMemo } from 'react';
import { useUsers, User, CreateUserInput, UpdateUserInput } from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  MoreVertical,
  X,
  Save,
  Crown,
  Eye,
  Settings,
  CheckCircle,
  AlertTriangle,
  Key,
} from 'lucide-react';

export default function UserManager() {
  const { hasPermission } = useAuth();
  const {
    users,
    loading,
    createUser,
    updateUser,
    deleteUser,
    updateUserRoles,
    resetUserPassword,
    getUserStats,
    filterUsers,
    getAvailableRoles,
    getOrganizations,
  } = useUsers();

  // États locaux
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);

  // Vérification des permissions
  if (!hasPermission('manage_users')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions pour gérer les utilisateurs.</p>
        </div>
      </div>
    );
  }

  // Données filtrées
  const filteredUsers = useMemo(() => {
    return filterUsers({
      search: searchTerm,
      role: selectedRole,
      organization: selectedOrganization,
    });
  }, [filterUsers, searchTerm, selectedRole, selectedOrganization]);

  // Statistiques
  const stats = getUserStats();
  const availableRoles = getAvailableRoles();
  const organizations = getOrganizations();

  // Gestionnaires d'événements
  const handleCreateUser = () => {
    setShowCreateModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    setShowDeleteConfirm(userId);
  };

  const handleResetPassword = async (user: User) => {
    const newPassword = await resetUserPassword(user.id);
    if (newPassword) {
      setGeneratedPassword(newPassword);
      setResetPasswordUser(user);
      setShowPasswordModal(true);
    }
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      await deleteUser(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleToggleRole = async (userId: string, role: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const currentRoles = [...user.roles];
    const hasRole = currentRoles.includes(role);

    let newRoles;
    if (hasRole) {
      newRoles = currentRoles.filter(r => r !== role);
      // S'assurer qu'il y a toujours au moins le rôle 'user'
      if (newRoles.length === 0) {
        newRoles = ['user'];
      }
    } else {
      newRoles = [...currentRoles, role];
    }

    await updateUserRoles(userId, newRoles);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'moderator': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Gestion des Utilisateurs
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez les utilisateurs, leurs rôles et permissions
              </p>
            </div>
            <button
              onClick={handleCreateUser}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Inviter un utilisateur
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Administrateurs</p>
                <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Crown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Éditeurs</p>
                <p className="text-2xl font-bold text-blue-600">{stats.editors}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Edit className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-600">{stats.users}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nouveaux ce mois</p>
                <p className="text-2xl font-bold text-green-600">{stats.new_this_month}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filtre par rôle */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les rôles</option>
              {availableRoles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>

            {/* Filtre par organisation */}
            <select
              value={selectedOrganization}
              onChange={(e) => setSelectedOrganization(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les organisations</option>
              {organizations.map(org => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>

            {/* Bouton reset */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRole('');
                setSelectedOrganization('');
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Utilisateurs ({filteredUsers.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organisation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé le
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar_url ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.avatar_url}
                              alt={user.full_name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {user.full_name?.charAt(0) || 'U'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        {user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </div>
                        )}
                        {user.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.organization && (
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {user.organization}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map(role => (
                          <span
                            key={role}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(role)}`}
                          >
                            {availableRoles.find(r => r.value === role)?.label || role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(user)}
                          className="text-orange-600 hover:text-orange-900 p-1"
                          title="Réinitialiser le mot de passe"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-500">
                {searchTerm || selectedRole || selectedOrganization
                  ? 'Essayez de modifier vos filtres de recherche.'
                  : 'Commencez par inviter votre premier utilisateur.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modales pour création/édition - À implémenter */}
      {showCreateModal && (
        <UserFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (data) => {
            const result = await createUser(data);
            if (result?.password) {
              setGeneratedPassword(result.password);
              setShowPasswordModal(true);
            }
            setShowCreateModal(false);
          }}
          title="Inviter un nouvel utilisateur"
          availableRoles={availableRoles}
        />
      )}

      {showEditModal && editingUser && (
        <UserFormModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingUser(null);
          }}
          onSubmit={(data) => updateUser({ ...data, id: editingUser.id })}
          title="Modifier l'utilisateur"
          initialData={editingUser}
          availableRoles={availableRoles}
        />
      )}

      {/* Modal pour afficher le mot de passe généré */}
      {showPasswordModal && generatedPassword && (
        <PasswordDisplayModal
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setGeneratedPassword(null);
            setResetPasswordUser(null);
          }}
          password={generatedPassword}
          user={resetPasswordUser}
          isReset={!!resetPasswordUser}
        />
      )}
    </div>
  );
}

// Composant Modal pour création/édition d'utilisateurs
interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserInput) => Promise<any>;
  title: string;
  initialData?: User;
  availableRoles: Array<{ value: string; label: string; description: string }>;
}

function UserFormModal({ isOpen, onClose, onSubmit, title, initialData, availableRoles }: UserFormModalProps) {
  const [formData, setFormData] = useState<CreateUserInput>({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || '',
    organization: initialData?.organization || '',
    phone: initialData?.phone || '',
    location: initialData?.location || '',
    linkedin: initialData?.linkedin || '',
    twitter: initialData?.twitter || '',
    bio: initialData?.bio || '',
    roles: initialData?.roles || ['user'],
    generate_password: !initialData, // true pour création, false pour édition
    custom_password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = (role: string) => {
    const currentRoles = [...formData.roles];
    const hasRole = currentRoles.includes(role);

    let newRoles;
    if (hasRole) {
      newRoles = currentRoles.filter(r => r !== role);
      // S'assurer qu'il y a toujours au moins le rôle 'user'
      if (newRoles.length === 0) {
        newRoles = ['user'];
      }
    } else {
      newRoles = [...currentRoles, role];
    }

    setFormData(prev => ({ ...prev, roles: newRoles }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Informations professionnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organisation
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ville, Pays"
            />
          </div>

          {/* Options de mot de passe (uniquement pour la création) */}
          {!initialData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-medium text-blue-900">Configuration du mot de passe</h3>
              
              {/* Option génération automatique */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="generate-password"
                    type="radio"
                    name="password-option"
                    checked={formData.generate_password}
                    onChange={() => setFormData(prev => ({ 
                      ...prev, 
                      generate_password: true, 
                      custom_password: '' 
                    }))}
                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="generate-password" className="text-sm font-medium text-blue-900">
                    Générer automatiquement un mot de passe sécurisé
                  </label>
                  <p className="text-xs text-blue-700 mt-1">
                    Un mot de passe temporaire sera créé et affiché après la création du compte.
                  </p>
                </div>
              </div>

              {/* Option mot de passe personnalisé */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="custom-password"
                    type="radio"
                    name="password-option"
                    checked={!formData.generate_password}
                    onChange={() => setFormData(prev => ({ 
                      ...prev, 
                      generate_password: false 
                    }))}
                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <label htmlFor="custom-password" className="text-sm font-medium text-blue-900">
                    Définir un mot de passe personnalisé
                  </label>
                  <p className="text-xs text-blue-700 mt-1 mb-2">
                    Saisissez un mot de passe sécurisé pour l'utilisateur.
                  </p>
                  {!formData.generate_password && (
                    <input
                      type="password"
                      value={formData.custom_password}
                      onChange={(e) => setFormData(prev => ({ ...prev, custom_password: e.target.value }))}
                      placeholder="Mot de passe (min. 8 caractères)"
                      minLength={8}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required={!formData.generate_password}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Rôles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rôles et permissions
            </label>
            <div className="space-y-3">
              {availableRoles.map(role => (
                <div key={role.value} className="flex items-start">
                  <input
                    type="checkbox"
                    id={`role-${role.value}`}
                    checked={formData.roles.includes(role.value)}
                    onChange={() => handleRoleToggle(role.value)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <label htmlFor={`role-${role.value}`} className="text-sm font-medium text-gray-700">
                      {role.label}
                    </label>
                    <p className="text-xs text-gray-500">{role.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biographie
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description courte de l'utilisateur..."
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {initialData ? 'Mettre à jour' : 'Inviter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Composant Modal pour afficher le mot de passe généré
interface PasswordDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  password: string;
  user?: User | null;
  isReset?: boolean;
}

function PasswordDisplayModal({ isOpen, onClose, password, user, isReset = false }: PasswordDisplayModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isReset ? 'Mot de passe réinitialisé' : 'Mot de passe généré'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          {user && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 h-8 w-8">
                  {user.avatar_url ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar_url}
                      alt={user.full_name}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        {user.full_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}
          
          <p className="text-gray-600 mb-4">
            {isReset 
              ? 'Un nouveau mot de passe sécurisé a été généré pour cet utilisateur. Copiez-le et partagez-le de manière sécurisée.'
              : 'Un mot de passe sécurisé a été généré pour le nouvel utilisateur. Copiez-le et partagez-le de manière sécurisée.'
            }
          </p>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <code className="text-lg font-mono text-gray-900 break-all">
                {password}
              </code>
              <button
                onClick={copyToClipboard}
                className="ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                title="Copier"
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Important</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Ce mot de passe ne sera plus affiché. Assurez-vous de le copier 
                  et de le transmettre à l'utilisateur de manière sécurisée.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Copié !
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Copier
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
