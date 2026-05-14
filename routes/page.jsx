"use client";

import { useEffect, useState, use } from "react";

export default function InvestorDetailsPage({ params }) {
  const resolvedParams = use(params);

  const { investor_id } = resolvedParams;

  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInvestor() {
      try {
        console.log("Investor ID:", investor_id);

        const response = await fetch(
          `http://localhost:3000/api/investors/${investor_id}`
        );

        console.log("Response Status:", response.status);

        if (!response.ok) {
          throw new Error(
            `Unable to fetch investor details. Status: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("Investor Data:", data);

        setInvestor(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (investor_id) {
      fetchInvestor();
    }
  }, [investor_id]);

  if (loading) {
    return <p>Loading investor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!investor) {
    return <p>No investor found.</p>;
  }

  const fullName = [
    investor.first_name,
    investor.middle_name,
    investor.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <h1>{fullName}</h1>

      <p>
        <strong>Investor ID:</strong> {investor.investor_id}
      </p>

      <p>
        <strong>Email:</strong> {investor.email}
      </p>

      <p>
        <strong>Aadhaar:</strong> {investor.adhaar_no}
      </p>

      <p>
        <strong>PAN:</strong> {investor.pancard_no}
      </p>

      <p>
        <strong>Passport:</strong> {investor.passport_no}
      </p>

      <p>
        <strong>Gender:</strong> {investor.gender}
      </p>

      <p>
        <strong>Occupation:</strong> {investor.occupation}
      </p>

      <p>
        <strong>Annual Income:</strong> {investor.annual_income}
      </p>

      <p>
        <strong>Education:</strong> {investor.education}
      </p>

      <p>
        <strong>Qualification:</strong> {investor.qualification}
      </p>

      <p>
        <strong>Address:</strong> {investor.address}
      </p>
    </div>
  );
}
