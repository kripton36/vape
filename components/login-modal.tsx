import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LoginModalProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="text-3xl">🐼</div>
            Welcome Back, Panda!
          </DialogTitle>
          <DialogDescription>Sign in to continue your zen journey.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="panda@bamboo.com" className="rounded-full" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" className="rounded-full" />
          </div>
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full">
          Sign In
        </Button>
        <div className="text-center text-sm text-gray-500">
          Not part of the family?{" "}
          <a href="#" className="font-medium text-green-600 hover:underline">
            Sign up
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
