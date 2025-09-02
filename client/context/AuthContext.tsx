import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isLoadingRef = useRef(true);

  // Garder une référence à jour pour éviter les fermetures obsolètes
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

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
          // Récupérer les informations du profil (ne jette pas d'exception si aucune ligne)
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          if (profileError) {
            console.warn(
              "[Auth] Profil non récupéré (continuons avec les métadonnées de session):",
              profileError,
            );
          }

          const profileRoles: string[] = Array.isArray(profileData?.roles)
            ? (profileData!.roles as string[])
            : [];
          const isAdmin =
            profileRoles.includes("admin") || session.user.role === "admin";
          const safePermissions: string[] = Array.isArray(
            session.user.user_metadata?.permissions,
          )
            ? (session.user.user_metadata!.permissions as string[])
            : [];
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
            organization:
              typeof profileData?.organization === "string"
                ? profileData.organization
                : "",
            avatarUrl:
              (typeof profileData?.avatar_url === "string"
                ? profileData.avatar_url
                : undefined) || session.user.user_metadata?.avatar_url || "",
            user_metadata: session.user.user_metadata,
            role: isAdmin ? "admin" : session.user.role || "user",
            roles:
              profileRoles.length > 0
                ? profileRoles
                : [session.user.role || "user"],
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
              : safePermissions,
          };

          setUser(userData);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fallback: ne jamais rester bloqué en chargement indéfiniment
    const safetyTimeout = setTimeout(() => {
      if (isLoadingRef.current) {
        console.warn("[Auth] Timeout de chargement atteint – forcer isLoading=false");
        setIsLoading(false);
      }
    }, 7000);

    checkUser();

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Changement d'état d'authentification:", event);

      if (
        event === "SIGNED_IN" ||
        event === "INITIAL_SESSION" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        if (session?.user) {
          // Recharger les données utilisateur (sans jeter en cas d'absence)
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          const profileRoles: string[] = Array.isArray(profileData?.roles)
            ? (profileData!.roles as string[])
            : [];
          const isAdmin =
            profileRoles.includes("admin") || session.user.role === "admin";
          const safePermissions: string[] = Array.isArray(
            session.user.user_metadata?.permissions,
          )
            ? (session.user.user_metadata!.permissions as string[])
            : [];

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
            organization:
              typeof profileData?.organization === "string"
                ? profileData.organization
                : "",
            avatarUrl:
              (typeof profileData?.avatar_url === "string"
                ? profileData.avatar_url
                : undefined) || session.user.user_metadata?.avatar_url || "",
            user_metadata: session.user.user_metadata,
            role: isAdmin ? "admin" : session.user.role || "user",
            roles:
              profileRoles.length > 0
                ? profileRoles
                : [session.user.role || "user"],
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
              : safePermissions,
          };

          setUser(userData);
          // S'assurer que l'UI sort de l'état de chargement quand on reçoit un event positif
          setIsLoading(false);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const requestId = Math.random().toString(36).substr(2, 9);
    console.group(`🔐 [${requestId}] Tentative de connexion`);
    console.log("📧 Email:", email);
    console.log("🔄 Appel à signInWithPassword...");

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
        console.error("❌ Code d'erreur:", (error as any).status);
        console.error("❌ Message:", error.message);
        console.log("🔑 Réponse de signInWithPassword:", {
          user: data?.user ? "✅ Utilisateur présent" : "❌ Aucun utilisateur",
          session: data?.session ? "✅ Session présente" : "❌ Aucune session",
          error: error ? `❌ Erreur: ${error.message}` : "✅ Aucune erreur",
        });
        console.groupEnd();
        return false;
      }

      if (data?.user) {
        console.log("✅ Connexion réussie, récupération du profil...");
        console.log("🔄 Mise à jour de l'état utilisateur avec les informations de base...");
        // On ne met pas à jour l'état ici, on attend d'avoir toutes les données

        console.log("🔄 Récupération des informations du profil...");
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();

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

        const computedRole: string = (profileData?.role ||
          data.user.user_metadata?.role ||
          "user") as string;
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
            data.user.user_metadata?.full_name
              ?.split(" ")
              .slice(1)
              .join(" ") ||
            "",
          organization:
            typeof profileData?.organization === "string"
              ? profileData.organization
              : "",
          avatarUrl:
            (typeof profileData?.avatar_url === "string"
              ? profileData.avatar_url
              : undefined) || data.user.user_metadata?.avatar_url || "",
          user_metadata: data.user.user_metadata,
          role: isAdmin
            ? "admin"
            : computedRole,
          roles: [computedRole],
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
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) {
      return false;
    }

    // Si l'utilisateur est admin, il a toutes les permissions
    if (user.role === "admin") {
      return true;
    }

    // Vérifier si l'utilisateur a la permission spécifique
    return user.permissions?.includes(permission) || false;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
    isLoading,
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
