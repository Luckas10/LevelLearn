import "./Campfire.css";

export function Campfire({ isActive }) {
  return (
    <div className="stage">
      <div className="campfire">

        {/* SPARKS */}
        <div className={`sparks ${isActive ? "active" : ""}`}>
          <div className="spark"></div>
          <div className="spark"></div>
          <div className="spark"></div>
          <div className="spark"></div>
          <div className="spark"></div>
          <div className="spark"></div>
          <div className="spark"></div>
          <div className="spark"></div>
        </div>

        {/* LOGS */}
        <div className="logs">
          {Array.from({ length: 7 }).map((_, i) => (
            <div className="log" key={i}>
              {Array.from({ length: 10 }).map((_, j) => (
                <div className="streak" key={j}></div>
              ))}
            </div>
          ))}
        </div>

        {/* STICKS */}
        <div className="sticks">
          <div className="stick"></div>
          <div className="stick"></div>
          <div className="stick"></div>
          <div className="stick"></div>
        </div>

        {/* FIRE */}
        <div className={`fire ${isActive ? "active" : ""}`}>
          <div className="fire__red">
            {Array.from({ length: 7 }).map((_, i) => <div className="flame" key={i}></div>)}
          </div>

          <div className="fire__orange">
            {Array.from({ length: 7 }).map((_, i) => <div className="flame" key={i}></div>)}
          </div>

          <div className="fire__yellow">
            {Array.from({ length: 5 }).map((_, i) => <div className="flame" key={i}></div>)}
          </div>

          <div className="fire__white">
            {Array.from({ length: 7 }).map((_, i) => <div className="flame" key={i}></div>)}
          </div>
        </div>

      </div>
    </div>
  );
}
