"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-toastify"
import { loginRequest } from "@/http"
import { useUser } from "@/UserContext"
import { useRouter } from "next/navigation"

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {isAuthenticated,user,setUser,setIsAuthenticated} = useUser();
  const router = useRouter();


  useEffect(() => {
    if(isAuthenticated == true) {
      router.push(`/folder/${user.rootFolder}`);
    }
  },[isAuthenticated]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await loginRequest(email, password);
      toast.success(res.data.message);
      setUser(res.data.user);
      setIsAuthenticated(true);
      router.push(`/folder/${res.data.user.rootFolder}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }finally {
      setIsLoading(false);
    }
  },[email,password]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-purple-600 flex flex-col">
      <header className="p-4">
        <Button variant="ghost" size="icon" className="text-white">
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Login to Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-500" isLoading={isLoading}>
                Log In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" className="text-sm text-gray-600">
              Forgot password?
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

