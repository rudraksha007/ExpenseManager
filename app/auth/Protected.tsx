import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Protected({ children }: { children: React.ReactNode }) {
    const session = useSession();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        console.log(session);
        if (session.status === 'loading') {
            return; // Wait for session to load
        }
        
        if (!session.data) {
            router.push("/auth/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [session, router]);

    // Only render children when authenticated
    return isAuthenticated ? children : null;
}