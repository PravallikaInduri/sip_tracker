import Link from "next/link";
import styles from "./Sidebar.module.css";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Investors", href: "/dashboard/investors" },
  { label: "Holdings", href: "/dashboard/holdings" },
  { label: "Net Worth", href: "/dashboard/networth" },
  { label: "Funds", href: "/dashboard/funds" },
  { label: "SIPs", href: "/dashboard/sips" },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>SIP Investor Portal</div>
      <nav className={styles.navList}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={styles.navItem}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className={styles.footer}>Use the navigation to explore investor details.</div>
    </aside>
  );
}
