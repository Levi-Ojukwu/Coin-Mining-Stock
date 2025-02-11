import type React from "react"

type CoinlibWidgetProps = {}

const CoinlibWidget: React.FC<CoinlibWidgetProps> = () => {
  return (
    <div className="h-[350px] bg-white overflow-hidden box-border border rounded-md text-right leading-[14px] text-xs shadow-[inset_0_-20px_0_0_#56667F] p-[1px] m-0 w-full">
      <div className="h-[540px] p-0 m-0 w-full">
        <iframe
          src="https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=859&pref_coin_id=1505"
          width="100%"
          height="350px"
          scrolling="auto"
          marginWidth={0}
          marginHeight={0}
          frameBorder={0}
          style={{ border: 0, margin: 0, padding: 0, lineHeight: "14px" }}
        />
      </div>
      <div className="text-white leading-[14px] flex items-center justify-center mb-2 font-normal box-border p-[2px_6px] w-full font-[Verdana,Tahoma,Arial,sans-serif]">
        <p
          className=" text-gray-600 font-semibold no-underline text-sm"
        >
          Powered by:
        </p>
        <span>&nbsp;Coin Mining Stock</span>
      </div>
    </div>
  )
}

export default CoinlibWidget

