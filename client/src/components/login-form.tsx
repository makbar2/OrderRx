import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { User } from "@/Interfaces/User";
import { redirect } from "react-router-dom";
export function LoginForm({className,...props}: React.ComponentProps<"div">) {
  const [user,setUser] = useState<User>({
    email: "",
    password: ""
  });

  const navigate = useNavigate();


  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) //i just took this from pt form
  {
      const { name, value } = e.target;
      setUser((prev) => ({
        ...prev,
        [name]: value,
      }));
  }

  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>,user:User,setUser:React.Dispatch<React.SetStateAction<User>>) 
  {
    e.preventDefault();
    try{
      console.log(user);
      const response = await fetch("https://localhost:7295/login", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Email: user.email,
          Password : user.password
        })
      });
      const data = await response.json();
      if(response.status === 401)
      {
        console.log("password is incorrect");
      }else if(response.status === 200)
      {
        console.log("succesful login");
        navigate("/");
      }else{
        console.log("something bad happened when trying to connect ");
      }
    }catch(error)
    {
      console.log(`an exception was thrown when trying to submit the form ${error}`);
    }

  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e)=>{handleSubmit(e,user,setUser)}}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password? Too bad.
                  </a>
                </div>
                <Input id="password" type="password" name="password" required onChange={handleInputChange}/>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>

              </div>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}

