import { useAuth } from "@/contexts/AuthContext"

export default function useAuthState() {
  return useAuth()
}