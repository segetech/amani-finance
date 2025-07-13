import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  demoAccounts,
  getRoleDisplayName,
  getRoleColor,
} from "../lib/demoAccounts";
import {
  ArrowLeft,
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  Eye,
  Mail,
  Calendar,
  Users as UsersIcon,
  Download,
  MoreHorizontal,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Users() {
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  // Check permissions
  if (!user || !hasPermission("manage_users")) {
    return (
      <div className="min-h-screen bg-[#E5DDD2] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-amani-primary mb-4">
            Accès refusé
          </h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour gérer les
            utilisateurs.
          </p>
          <Link
            to="/dashboard"
            className="bg-amani-primary text-white px-6 py-2 rounded-lg hover:bg-amani-primary/90 transition-colors"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  const filteredUsers = demoAccounts.filter((u) => {
    const matchesSearch =
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.organization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === "all" || u.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const handleViewUser = (userId: string) => {
    const userToView = demoAccounts.find((u) => u.id === userId);
    setSelectedUser(userToView);
    setShowUserModal(true);
  };

  const handleEditUser = (userId: string) => {
    // Navigate to edit user page or open edit modal
    console.log("Editing user:", userId);
    alert("Fonctionnalité d'édition à implémenter");
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = demoAccounts.find((u) => u.id === userId);
    setUserToDelete(userToDelete);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      console.log("Deleting user:", userToDelete.id);
      alert(
        `Utilisateur ${userToDelete.firstName} ${userToDelete.lastName} supprimé avec succès!`,
      );
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleBulkRoleChange = () => {
    alert(
      `Modifier le rôle de ${selectedUsers.length} utilisateur(s) sélectionné(s)`,
    );
  };

  const handleBulkDelete = () => {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer ${selectedUsers.length} utilisateur(s) ?`,
      )
    ) {
      console.log("Bulk deleting users:", selectedUsers);
      alert(`${selectedUsers.length} utilisateur(s) supprimé(s) avec succès!`);
      setSelectedUsers([]);
    }
  };

  const handleSendPasswordReset = (userId: string) => {
    const userToReset = demoAccounts.find((u) => u.id === userId);
    if (userToReset) {
      alert(`Email de réinitialisation envoyé à ${userToReset.email}`);
    }
  };

  const roles = [
    "admin",
    "editeur",
    "analyste",
    "moderateur",
    "abonne",
    "visiteur",
  ];

  const userStats = {
    total: demoAccounts.length,
    active: demoAccounts.filter(
      (u) =>
        new Date(u.lastLogin) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    ).length,
    admins: demoAccounts.filter((u) => u.role === "admin").length,
    premium: demoAccounts.filter((u) => u.role === "abonne").length,
  };

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-amani-primary hover:text-amani-primary/80 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-amani-primary mb-2">
                Gestion des utilisateurs
              </h1>
              <p className="text-gray-600">
                Gérez les comptes utilisateurs, rôles et permissions
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-amani-primary text-amani-primary rounded-lg hover:bg-amani-secondary/30 transition-colors">
                <Download className="w-4 h-4" />
                Exporter
              </button>
              <Link
                to="/dashboard/users/new"
                className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Nouvel utilisateur
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total</h3>
              <UsersIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-amani-primary">
              {userStats.total}
            </div>
            <div className="text-sm text-gray-600">utilisateurs</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Actifs</h3>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-amani-primary">
              {userStats.active}
            </div>
            <div className="text-sm text-gray-600">cette semaine</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Admins</h3>
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-amani-primary">
              {userStats.admins}
            </div>
            <div className="text-sm text-gray-600">administrateurs</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Premium</h3>
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-amani-primary">
              {userStats.premium}
            </div>
            <div className="text-sm text-gray-600">abonnés</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-white/50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, email ou organisation..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
              >
                <option value="all">Tous les rôles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {getRoleDisplayName(role)}
                  </option>
                ))}
              </select>
              <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filtres
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-amani-primary text-white rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {selectedUsers.length} utilisateur(s) sélectionné(s)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkRoleChange}
                  className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Modifier le rôle
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-white/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-amani-primary focus:ring-amani-primary border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organisation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière connexion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((u) => {
                  const isRecent =
                    new Date(u.lastLogin) >
                    new Date(Date.now() - 24 * 60 * 60 * 1000);
                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(u.id)}
                          onChange={() => handleSelectUser(u.id)}
                          className="h-4 w-4 text-amani-primary focus:ring-amani-primary border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-amani-primary to-amani-primary/80 rounded-full flex items-center justify-center text-white font-semibold">
                            {u.firstName.charAt(0)}
                            {u.lastName.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-amani-primary">
                              {u.firstName} {u.lastName}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(u.role)}`}
                        >
                          {getRoleDisplayName(u.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {u.organization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {u.lastLogin}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {isRecent ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <span
                            className={`text-sm ${isRecent ? "text-green-600" : "text-gray-600"}`}
                          >
                            {isRecent ? "En ligne" : "Hors ligne"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleViewUser(u.id)}
                            className="text-amani-primary hover:text-amani-primary/80 p-1 rounded hover:bg-amani-secondary/20 transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditUser(u.id)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Modifier l'utilisateur"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Supprimer l'utilisateur"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="relative group">
                            <button className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50 transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {/* Dropdown menu */}
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                              <button
                                onClick={() => handleSendPasswordReset(u.id)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Réinitialiser le mot de passe
                              </button>
                              <button
                                onClick={() =>
                                  alert(`Envoyer un message à ${u.email}`)
                                }
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Envoyer un message
                              </button>
                              <button
                                onClick={() =>
                                  alert(
                                    `Suspendre le compte de ${u.firstName} ${u.lastName}`,
                                  )
                                }
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Suspendre le compte
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permissions Management */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-amani-primary mb-6">
            Gestion des permissions par rôle
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => {
              const roleUsers = demoAccounts.filter((u) => u.role === role);
              const sampleUser = roleUsers[0];

              return (
                <div
                  key={role}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-amani-primary">
                      {getRoleDisplayName(role)}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getRoleColor(role)}`}
                    >
                      {roleUsers.length} utilisateur(s)
                    </span>
                  </div>
                  {sampleUser && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Permissions principales:
                      </h4>
                      <div className="space-y-1">
                        {sampleUser.permissions
                          .slice(0, 4)
                          .map((permission, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-xs"
                            >
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span className="text-gray-600">
                                {permission.replace(/_/g, " ")}
                              </span>
                            </div>
                          ))}
                        {sampleUser.permissions.length > 4 && (
                          <div className="text-xs text-gray-500">
                            +{sampleUser.permissions.length - 4} autres...
                          </div>
                        )}
                      </div>
                      <button className="w-full mt-4 text-amani-primary text-sm font-medium hover:underline">
                        Modifier les permissions
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
