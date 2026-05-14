"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";
import { getAuthUser, removeAuthCookies } from "@/lib/auth";

export default function Navbar({ investorName }) {
  const router = useRouter();
  const [userName, setUserName] = useState("Investor");

  useEffect(() => {
    const user = getAuthUser();
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);

  const handleLogout = () => {
    removeAuthCookies();
    router.push("/login");
  };

  return (
    <div className={styles.navbar}>
      <div>
        <p className={styles.label}>Logged in as</p>
        <p className={styles.user}>{userName}</p>
      </div>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
