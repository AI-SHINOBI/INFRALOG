export default function StatusBadge({ status }) {
  let color = "green";

  if (status === "Critical") color = "red";
  if (status === "Moderate") color = "orange";

  return <span className={`badge ${color}`}>{status}</span>;
}