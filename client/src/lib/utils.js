import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
  "bg-[#ff006e57] text-[#712c4a] border-[1px] border-[#712c4aaa]",
  "bg-[#ff7e6757] text-[#ff006e] border-[1px] border-[#ff006faa]",
  "bg-[#ff006e57] text-[#ff7e67] border-[1px] border-[#ff7e67aa]",
]
export const getColor = (color) =>{
  if (!color >=0 && color < colors.length) {
    return colors[color]
  }
  return colors[0]
}