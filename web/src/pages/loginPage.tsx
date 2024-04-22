import { setCookie } from "react-use-cookie";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { useToast } from "../components/ui/use-toast";
import { Toaster } from "../components/ui/toaster";
import { login } from "@/clients/sst-client";

const API = "http://localhost:5432";

export default function LoginPage() {
  const [secret, setSecret] = useState("");
  const { toast } = useToast();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex w-96 gap-2">
        <Input
          placeholder="secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="w-64"
        />
        <Button
          onClick={async () => {
            try {
              const response = await login(secret);
              if (response === "OK") {
                setCookie("secret", secret, { days: 1 });
                location.reload();
              } else {
                throw new Error("Invalid secret");
              }
            } catch (error) {
              // console.log("error", error);
              toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data || "Something went wrong",
              });
            }
          }}
        >
          Login
        </Button>
      </div>
      <Toaster />
    </div>
  );
}
