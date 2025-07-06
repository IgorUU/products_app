import { useAuth } from "../hooks/useAuth";

const LogoutUser = () => {
  const { logout } = useAuth();
  return <button onClick={logout}>Logout</button>;
};

export default LogoutUser;
