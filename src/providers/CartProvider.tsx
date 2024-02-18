import { CartItem, Product } from "@/types";
import { randomUUID } from "expo-crypto";
import { PropsWithChildren, createContext, useContext, useState } from "react";

type CartType = {
    items: CartItem[],
    addItem: (product: Product, size: CartItem['size']) => void;
    updateQuantity: (itemId: string, amount: -1 | 1) => void;
    total: number;
}


export const CartContext = createContext<CartType>({
    items: [],
    addItem: () => { },
    updateQuantity: () => { },
    total: 0,

});

const CartProvider = ({ children }: PropsWithChildren) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const addItem = (product: Product, size: CartItem['size']) => {
        //  if already in cart, increament quantity
        const existingItem = items.find(
            (item) => item.product === product && item.size === size
        );

        if (existingItem) {
            updateQuantity(existingItem.id, 1);
        }


        const newCartItem: CartItem = {
            id: randomUUID(),
            product,
            product_id: product.id,
            size,
            quantity: 1,
        };

        setItems([newCartItem, ...items]);
    };

    // update Quantity
    const updateQuantity = (itemId: string, amount: 1 | -1) => {
        setItems((existingItems) =>
            existingItems
                .map((it) =>
                    it.id === itemId ? { ...it, quantity: it.quantity + amount } : it
                )
                .filter((item) => item.quantity > 0)
        );
    };


    return (
        <CartContext.Provider value={{ items, addItem, updateQuantity, total }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);