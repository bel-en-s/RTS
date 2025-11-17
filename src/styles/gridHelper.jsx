export default function GridHelper() {
  const columns = Array.from({ length: 13 }); // desktop default
  return (
    <div className="grid-helper">
      {/* margen izquierdo */}
      <div></div>

      {/* columnas */}
      {columns.map((_, i) => (
        <div key={i}></div>
      ))}

      {/* margen derecho */}
      <div></div>
    </div>
  );
}