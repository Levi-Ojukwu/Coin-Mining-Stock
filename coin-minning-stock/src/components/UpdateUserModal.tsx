import type React from "react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"

interface User {
  id: number
  name: string
  email: string
  balance: number
  total_withdrawal: number
}

interface UpdateUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onUserUpdate: () => void
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate()

  const handleUpdateBalanceAndWithdrawal = () => {
    if (user) {
      navigate(`/admin/update-user-balance/${user.id}`)
    }
    onClose()
  }

  const handleUpdateTransactionHistory = () => {
    if (user) {
      navigate(`/admin/update-user-transactions/${user.id}`)
    }
    onClose()
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User: {user.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Choose an action:</p>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdateBalanceAndWithdrawal}>Update Balance and Withdrawal</Button>
          <Button onClick={handleUpdateTransactionHistory}>Update Transaction History</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateUserModal

