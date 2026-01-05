import "./Table.css";

export default function Table({
  title = "Capabilities with Honeywell technologies",
  columns = ["Service", "Focus", "Description", "Main technologies"],
  rows = [],
}) {
  return (
    <section className="tableBlock">
      <h2 className="tableBlock__title title-large">{title}</h2>

      <div className="tableBlock__frame">
        {/* Header */}
        <div className="tableBlock__head">
          {columns.map((c, i) => (
            <div key={c + i} className="tableBlock__headCell subtitle-md">
              {c}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="tableBlock__body">
          {rows.map((row, idx) => (
            <div key={idx} className="tableBlock__row">
              {/* Col 1 */}
              <div className="tableBlock__cell tableBlock__cell--c1 title-small">
                {row.c1}
              </div>

              {/* Col 2 */}
              <div className="tableBlock__cell tableBlock__cell--c2 title-body">
                {row.c2}
              </div>

              {/* Col 3 */}
              <div className="tableBlock__cell tableBlock__cell--c3 body-small">
                {row.c3}
              </div>

              {/* Col 4 (texto o lista) */}
              <div className="tableBlock__cell tableBlock__cell--c4 body-small">
                {Array.isArray(row.c4) ? (
                  <ul className="tableBlock__bullets">
                    {row.c4.map((t, i) => (
                      <li key={t + i}>{t}</li>
                    ))}
                  </ul>
                ) : (
                  row.c4
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
