export default function StatCard({ value, label, icon, bg, color }) {
  return (
    <div className="stat-card">
      <div>
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
      <div className="stat-icon" style={{ background: bg, color }}>
        {icon}
      </div>
    </div>
  );
}
