import "./Sidebar.css";

export default function LocalSearch() {
  return (
    <div className="search-container localSearch">
      <input id="ticker" className="input" type="text" placeholder="Search" />
      <button id="fetch-apod" className="button">
        <img
          src="/search-magnifying-glass.svg"
          alt="Search Icon"
          width={50}
          height={50}
        />
      </button>
    </div>
  );
}
