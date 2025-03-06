"use client"

import type React from "react";
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface PaymentMethod {
  name: string
  icon: string
}

const paymentMethods: PaymentMethod[] = [
  { name: "PAYPAL", icon: "https://i.pcmag.com/imagery/reviews/068BjcjwBw0snwHIq0KNo5m-15..v1602794215.png" },
  { name: "CASH APP", icon: "https://i.pcmag.com/imagery/reviews/04HRj5uo69sdmpp5fuRSL6i-10.fit_scale.size_760x427.v1599074646.jpg" },
  { name: "BANK TRANSFER", icon: "https://www.marketreview.com/wp-content/uploads/2019/09/bank.jpg" },
  { name: "BITCOIN", icon: "https://www.shutterstock.com/image-vector/bitcoin-flat-design-icon-logo-600nw-2543546459.jpg" },
  { name: "ETHEREUM", icon: "https://cdn.pixabay.com/photo/2021/05/24/09/15/ethereum-logo-6278329_1280.png" },
  { name: "USDT ERC 20", icon: "https://selembardigital.com/wp-content/uploads/2020/05/Tether-USDT.png" },
  { name: "USDT TRC 20", icon: "https://coinrabbit.io/blog/wp-content/uploads/2022/01/tether-usdt-trc20.svg" },
  { name: "USDC", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdB_4izW61YTiJer_zLkxBBJBryuAxL-34PQ6NSe1JIVhjBVR69moeTGPqvf9GHxkTU5s&usqp=CAU" },
]

const WithdrawalPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    amount: "",
    pin: "",
  })

  const handleMethodClick = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setIsModalOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const whatsappMessage = `Hi CMS, I would love to make a withdrawal with the details bellow:%0A
Method: ${selectedMethod?.name}%0A
Name: ${formData.name}%0A
Address: ${formData.address}%0A
Amount: ${formData.amount}%0A
PIN: ${formData.pin}`

    window.open(`https://wa.me/+19044491705?text=${whatsappMessage}`, "_blank")
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-primary">Select Withdrawal Method</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className="flex flex-col items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleMethodClick(method)}
          >
            {/* <Image src={method.icon || "/placeholder.svg"} alt={method.name} width={64} height={64} /> */}
            <img src={method.icon} className="w-full h-[90px]" alt={method.name} />
            {/* <span className="mt-2 text-sm font-medium text-center">{method.name}</span> */}
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary text-xl">{selectedMethod?.name} Withdrawal</DialogTitle>
            <DialogDescription>Please fill in the details for your withdrawal request.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Enter Full Name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" placeholder="Enter Payment Address/Tag" value={formData.address} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter Amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="pin">PIN</Label>
              <Input id="pin" name="pin" type="password" placeholder="Enter PIN" value={formData.pin} onChange={handleInputChange} required />
            </div>
            <Button type="submit" className="w-full font-semibold text-gray-100 bg-gradient-to-r from-red-300 to-primary ">
              Submit Withdrawal Request
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default WithdrawalPage

