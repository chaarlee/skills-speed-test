import { setCookie } from "react-use-cookie";

export default function LogoutButton() {
  return (
    <button
      onClick={() => {
        setCookie("secret", "");
        location.reload();
      }}
    >
      Logout
    </button>
  );
}
