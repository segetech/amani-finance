import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import {
  Building,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  MapPin,
  Globe,
  Mail,
  Phone,
  Calendar,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

export default function Organizations() {
  const { user, hasPermission } = useAuth();
  const { success, error, warning } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);

  // Check permissions after all hooks
  if (!user || !hasPermission("system_settings")) {
    return (
      <DashboardLayout
        title="Accès refusé"
        subtitle="Vous n'avez pas les permissions nécessaires"
      >
        <div className="flex items-center justify-center py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
            <h2 className="text-2xl font-bold text-amani-primary mb-4">
              Accès refusé
            </h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas les permissions nécessaires pour gérer les
              organisations.
            </p>
            <Link
              to="/dashboard"
              className="bg-amani-primary text-white px-6 py-2 rounded-lg hover:bg-amani-primary/90 transition-colors"
            >
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const organizations = [
    {
      id: "1",
      name: "Banque Centrale des États de l'Afrique de l'Ouest",
      shortName: "BCEAO",
      type: "Institution financière",
      country: "Mali",
      city: "Bamako",
      status: "active",
      members: 245,
      website: "https://www.bceao.int",
      email: "contact@bceao.int",
      phone: "+223 20 22 73 00",
      description:
        "Institution monétaire régionale de l'Union économique et monétaire ouest-africaine",
      createdAt: "2023-01-15",
      lastActive: "2024-01-15 14:30",
    },
    {
      id: "2",
      name: "Centre Africain d'Études Supérieures en Gestion",
      shortName: "CESAG",
      type: "Institution éducative",
      country: "Sénégal",
      city: "Dakar",
      status: "active",
      members: 89,
      website: "https://www.cesag.sn",
      email: "info@cesag.sn",
      phone: "+221 33 859 92 00",
      description: "École de management et centre de recherche",
      createdAt: "2023-03-20",
      lastActive: "2024-01-14 16:45",
    },
    {
      id: "3",
      name: "Union Économique et Monétaire Ouest Africaine",
      shortName: "UEMOA",
      type: "Organisation régionale",
      country: "Burkina Faso",
      city: "Ouagadougou",
      status: "active",
      members: 156,
      website: "https://www.uemoa.int",
      email: "contact@uemoa.int",
      phone: "+226 25 31 88 73",
      description:
        "Union économique et monétaire de huit pays d'Afrique de l'Ouest",
      createdAt: "2023-02-10",
      lastActive: "2024-01-15 09:15",
    },
    {
      id: "4",
      name: "Association Sahélienne de Recherche Économique",
      shortName: "ASRE",
      type: "Association",
      country: "Niger",
      city: "Niamey",
      status: "pending",
      members: 32,
      website: "https://www.asre.ne",
      email: "info@asre.ne",
      phone: "+227 20 72 35 41",
      description: "Association de recherche sur l'économie sahélienne",
      createdAt: "2024-01-10",
      lastActive: "2024-01-13 11:20",
    },
    {
      id: "5",
      name: "Chambre de Commerce du Tchad",
      shortName: "CCT",
      type: "Chambre de commerce",
      country: "Tchad",
      city: "N'Djamena",
      status: "inactive",
      members: 67,
      website: "https://www.cct.td",
      email: "contact@cct.td",
      phone: "+235 22 52 36 41",
      description: "Chambre de commerce et d'industrie du Tchad",
      createdAt: "2023-06-25",
      lastActive: "2023-12-20 15:30",
    },
  ];

  const stats = [
    {
      label: "Organisations actives",
      value: organizations
        .filter((org) => org.status === "active")
        .length.toString(),
      icon: Building,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "En attente",
      value: organizations
        .filter((org) => org.status === "pending")
        .length.toString(),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      label: "Membres totaux",
      value: organizations
        .reduce((sum, org) => sum + org.members, 0)
        .toString(),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Pays couverts",
      value: new Set(organizations.map((org) => org.country)).size.toString(),
      icon: Globe,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-600" />;
      case "inactive":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || org.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateOrganization = () => {
    setShowNewOrgModal(true);
  };

  const handleEditOrganization = (id: string) => {
    success("Modification", `Modification de l'organisation ${id}`);
  };

  const handleDeleteOrganization = (id: string) => {
    warning("Suppression", `Organisation ${id} supprimée`);
  };

  const handleApproveOrganization = (id: string) => {
    success("Approuvé", `Organisation ${id} approuvée`);
  };

  return (
    <DashboardLayout
      title="Gestion des organisations"
      subtitle="Gérez les organisations partenaires et membres de la plateforme"
      actions={
        <>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher une organisation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actives</option>
              <option value="pending">En attente</option>
              <option value="inactive">Inactives</option>
            </select>
          </div>
          <button
            onClick={handleCreateOrganization}
            className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle organisation
          </button>
        </>
      }
    >
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border border-white/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-amani-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Organizations List */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/50">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-amani-primary">
                Organisations ({filteredOrganizations.length})
              </h2>
            </div>
          </div>

          <div className="p-6">
            {filteredOrganizations.length === 0 ? (
              <div className="text-center py-12">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune organisation trouvée
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== "all"
                    ? "Aucune organisation ne correspond à vos critères."
                    : "Commencez par ajouter votre première organisation."}
                </p>
                <button
                  onClick={handleCreateOrganization}
                  className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle organisation
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredOrganizations.map((org) => (
                  <div
                    key={org.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-amani-primary rounded-lg flex items-center justify-center text-white font-bold">
                            {org.shortName.slice(0, 2)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {org.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {org.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {org.city}, {org.country}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {org.members} membres
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">{org.description}</p>

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            <a
                              href={org.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amani-primary hover:underline"
                            >
                              Site web
                            </a>
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <a
                              href={`mailto:${org.email}`}
                              className="text-amani-primary hover:underline"
                            >
                              {org.email}
                            </a>
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {org.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Membre depuis{" "}
                            {new Date(org.createdAt).toLocaleDateString(
                              "fr-FR",
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-6">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(org.status)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              org.status,
                            )}`}
                          >
                            {org.status === "active" && "Active"}
                            {org.status === "pending" && "En attente"}
                            {org.status === "inactive" && "Inactive"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {org.status === "pending" && (
                            <button
                              onClick={() => handleApproveOrganization(org.id)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                              title="Approuver"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEditOrganization(org.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrganization(org.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
