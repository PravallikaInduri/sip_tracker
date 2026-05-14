import styles from "./Header.module.css";

export default function Header({ title, subtitle }) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.overline}>Investor Platform</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </header>
  );
}
