import { setCookie } from "react-use-cookie";

export default function LogoutButton() {
  return (
    <button
      className="text-sm"
      onClick={() => {
        setCookie("secret", "");
        location.reload();
      }}
    >
      Logout
    </button>
  );
}
