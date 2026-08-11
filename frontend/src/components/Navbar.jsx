const Navbar = ({ onLogout }) => {
  return (
    <header>
      <h1>Dashboard</h1>

      <button onClick={onLogout}>Logout</button>
    </header>
  );
};

export default Navbar;