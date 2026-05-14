import Link from "next/link";
import styles from "./Dashboard.module.css";
import {
  getInvestorEmail,
  getInvestorKey,
  getInvestorAadhaar,
  getInvestorName,
} from "./investorHelpers";

export default function InvestorsCard({ investors }) {
  return (
    <section className={styles.cardSection}>
      <h2>Investor Directory</h2>
      <p className={styles.cardDescription}>
        This list includes all investors available in the model.
      </p>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Aadhaar Number</th>
            </tr>
          </thead>
          <tbody>
            {investors?.map((investor, index) => {
              const investorId = investor?.investor_id || investor?.id || investor?.email || index;
              return (
                <tr key={getInvestorKey(investor, index)}>
                  <td>
                    <Link
                      href={`/dashboard/investors/${investorId}`}
                      className="text-slate-900 hover:text-sky-600 inline-block w-full"
                    >
                      {getInvestorName(investor)}
                    </Link>
                  </td>
                  <td>{getInvestorEmail(investor)}</td>
                  <td>{getInvestorAadhaar(investor)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
