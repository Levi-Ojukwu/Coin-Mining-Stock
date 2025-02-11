import type React from "react"
import { useState } from "react"
import { ClipboardIcon, CheckIcon } from "lucide-react"

interface CryptoAddress {
  name: string
  address: string
}

const addresses: CryptoAddress[] = [
  { name: "USDT ERC20", address: "0x81d0400FC6D820c32EBAE6d03973cC3C7EF62023" },
  { name: "USDT TRC20", address: "TQQa2kqWC1yB7A4vnJLAmBhFJruseUzktE" },
  { name: "Litecoin", address: "ltc1q4u5mj4uh3gps7lx5ypzyemw85c2ulz56e225cq" },
  { name: "Dogecoin", address: "DKJvbARKigNeqqzcN7k4LZZ14mkPUtqjBE" },
  { name: "TRON (TRX)", address: "TUKZ8G8w6BQM3RbSot4SQv7BEiwEoQ7NcZ" },
  { name: "Bitcoin (BTC)", address: "3Acg2zC87iAuUzbc7H1QZ2MFCP5ZDPxzqR" },
  { name: "Ethereum (ETH)", address: "0x14A76E4140492E1eC1E5F9c82c45931319c0d5A0" },
  { name: "USDC", address: "0xF3007773a6e9e38610a91A8FEaa578a024264065" },
]

const CryptoAddresses: React.FC = () => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopiedAddress(address)
      setTimeout(() => setCopiedAddress(null), 2000)
    })
  }

  return (
    <div className="bg-gradient-to-br from-[#00565c78] to-[#e4f33d4b] rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Cryptocurrency Addresses</h2>
      <div className="space-y-4">
        {addresses.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b last:border-b-0"
          >
            <div className="font-medium text-gray-700 mb-2 sm:mb-0">{item.name}</div>
            <div className="flex items-center w-full sm:w-auto">
              <code className="bg-[#e4f33d6b] px-2 py-1 rounded text-sm mr-2 overflow-x-auto max-w-[200px] sm:max-w-none">
                {item.address}
              </code>
              <button
                onClick={() => copyToClipboard(item.address)}
                className="p-2 text-[#00565ce4] hover:text-gray-700 focus:outline-none"
                title="Copy to clipboard"
              >
                {copiedAddress === item.address ? (
                  <CheckIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <ClipboardIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CryptoAddresses

