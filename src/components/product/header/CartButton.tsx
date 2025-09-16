
import React from "react";
import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
  progress: number;
}

const CartButton = ({ progress }: CartButtonProps) => {
  return (
    <div className="rounded-full">
      <button className="h-7 w-7 rounded-full flex items-center justify-center">
        <ShoppingCart
          className="text-gray-600"
          strokeWidth={1.5}
          size={17}
        />
      </button>
    </div>
  );
};

export default CartButton;
