import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, getCurrentUser } from "../lib/supabase";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  avatarUrl?: string;
  user_metadata?: {
    full_name?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    role?: string;
  };
  role?: string;
  roles?: string[];
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session au chargement
    const checkUser = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error(
            "Erreur lors de la récupération de la session:",
            sessionError,
          );
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          // Récupérer les informations du profil
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profileError) {
            console.error(
              "Erreur lors de la récupération du profil:",
              profileError,
            );
          }

          const isAdmin =
            profileData?.roles?.includes("admin") ||
            session.user.role === "admin";
          const userData = {
            id: session.user.id,
            email: session.user.email || "",
            firstName:
              profileData?.first_name ||
              session.user.user_metadata?.first_name ||
              session.user.user_metadata?.full_name?.split(" ")[0] ||
              "Utilisateur",
            lastName:
              profileData?.last_name ||
              session.user.user_metadata?.last_name ||
              session.user.user_metadata?.full_name
                ?.split(" ")
                .slice(1)
                .join(" ") ||
              "",
            organization: profileData?.organization || "",
            avatarUrl:
              profileData?.avatar_url ||
              session.user.user_metadata?.avatar_url ||
              "",
            user_metadata: session.user.user_metadata,
            role: isAdmin ? "admin" : session.user.role || "user",
            roles: profileData?.roles || [session.user.role || "user"],
            permissions: isAdmin
              ? [
                  "view_dashboard",
                  "create_articles",
                  "edit_articles",
                  "delete_articles",
                  "publish_articles",
                  "create_podcasts",
                  "edit_podcasts",
                  "delete_podcasts",
                  "publish_podcasts",
                  "create_economic_reports",
                  "create_indices",
                  "manage_users",
                  "view_analytics",
                  "manage_settings",
                ]
              : session.user.user_metadata?.permissions || [],
          };

          setUser(userData);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Changement d'état d'authentification:", event);

      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        if (session?.user) {
          // Recharger les données utilisateur
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          const isAdmin =
            profileData?.roles?.includes("admin") ||
            session.user.role === "admin";

          const userData = {
            id: session.user.id,
            email: session.user.email || "",
            firstName:
              profileData?.first_name ||
              session.user.user_metadata?.first_name ||
              session.user.user_metadata?.full_name?.split(" ")[0] ||
              "Utilisateur",
            lastName:
              profileData?.last_name ||
              session.user.user_metadata?.last_name ||
              session.user.user_metadata?.full_name
                ?.split(" ")
                .slice(1)
                .join(" ") ||
              "",
            organization: profileData?.organization || "",
            avatarUrl:
              profileData?.avatar_url ||
              session.user.user_metadata?.avatar_url ||
              "",
            user_metadata: session.user.user_metadata,
            role: isAdmin ? "admin" : session.user.role || "user",
            roles: profileData?.roles || [session.user.role || "user"],
            permissions: isAdmin
              ? [
                  "view_dashboard",
                  "create_articles",
                  "edit_articles",
                  "delete_articles",
                  "publish_articles",
                  "create_podcasts",
                  "edit_podcasts",
                  "delete_podcasts",
                  "publish_podcasts",
                  "create_economic_reports",
                  "create_indices",
                  "manage_users",
                  "view_analytics",
                  "manage_settings",
                ]
              : session.user.user_metadata?.permissions || [],
          };

          setUser(userData);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log("🔐 Tentative de connexion pour:", email);

    try {
      console.log("📡 Appel supabase.auth.signInWithPassword...");
      const startTime = Date.now();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log(`⏱️ Temps de réponse Supabase: ${Date.now() - startTime}ms`);
      console.log("📦 Réponse Supabase:", { data, error });

      if (error) {
        console.error("❌ Erreur de connexion:", error);
        console.error("❌ Code d'erreur:", error.status);
        console.error("❌ Message:", error.message);
        return false;
      }

      if (data?.user) {
        console.log("👤 Utilisateur trouvé, récupération du profil...");

        // Récupérer les informations supplémentaires du profil
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        console.log("📋 Profil data:", profileData);
        if (profileError) {
          console.error(
            "⚠️ Erreur lors de la récupération du profil:",
            profileError,
          );
          console.log("🔄 Continuons sans profil...");
        }

        // Vérifier si l'utilisateur est admin
        const isAdmin =
          profileData?.role === "admin" ||
          data.user.user_metadata?.role === "admin";
        console.log("🛡️ Est admin?", isAdmin);

        // Définir les permissions en fonction du rôle
        let userPermissions = [];
        if (isAdmin) {
          userPermissions = [
            "view_dashboard",
            "create_articles",
            "edit_articles",
            "delete_articles",
            "publish_articles",
            "create_podcasts",
            "edit_podcasts",
            "delete_podcasts",
            "publish_podcasts",
            "create_economic_reports",
            "create_indices",
            "manage_users",
            "view_analytics",
            "manage_settings",
          ];
        } else {
          // Permissions par défaut pour les utilisateurs non-admins
          userPermissions = [
            "view_dashboard",
            "create_articles",
            "edit_own_articles",
            "view_analytics",
          ];
        }

        const userData = {
          id: data.user.id,
          email: data.user.email || "",
          firstName:
            profileData?.first_name ||
            data.user.user_metadata?.first_name ||
            data.user.user_metadata?.full_name?.split(" ")[0] ||
            "Utilisateur",
          lastName:
            profileData?.last_name ||
            data.user.user_metadata?.last_name ||
            data.user.user_metadata?.full_name?.split(" ").slice(1).join(" ") ||
            "",
          organization: profileData?.organization || "",
          avatarUrl:
            profileData?.avatar_url ||
            data.user.user_metadata?.avatar_url ||
            "",
          user_metadata: data.user.user_metadata,
          role: isAdmin
            ? "admin"
            : profileData?.role || data.user.user_metadata?.role || "user",
          roles: [profileData?.role || data.user.user_metadata?.role || "user"],
          permissions: userPermissions,
        };

        console.log("✅ Utilisateur connecté avec les données:", userData);
        setUser(userData);
        return true;
      }

      console.log("❌ Aucun utilisateur retourné");
      return false;
    } catch (err) {
      console.error("💥 Erreur inattendue lors de la connexion:", err);
      console.error("💥 Stack trace:", err.stack);
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) {
      console.log("Aucun utilisateur connecté");
      return false;
    }

    console.log("Rôle de l'utilisateur:", user.role);
    console.log("Permissions de l'utilisateur:", user.permissions);
    console.log("Permission demandée:", permission);

    // Si l'utilisateur est admin, il a toutes les permissions
    if (user.role === "admin") {
      console.log("Accès accordé: utilisateur admin");
      return true;
    }

    // Vérifier si l'utilisateur a la permission spécifique
    const hasPerm = user.permissions?.includes(permission) || false;
    console.log("Permission accordée?", hasPerm);
    return hasPerm;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
