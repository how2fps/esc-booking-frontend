import  { createContext, useContext, useReducer, useEffect } from 'react';
import { TentType } from '../../type/TentType';

export interface WishlistItem extends TentType {
}

export interface WishlistState {
    wishlistArray: WishlistItem[]
}

type WishlistAction =
    | { type: 'ADD_TO_WISHLIST'; payload: TentType }
    | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
    | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] }

export interface WishlistContextProps {
    wishlistState: WishlistState;
    addToWishlist: (item: TentType) => void;
    removeFromWishlist: (itemId: string) => void;
}

export const WishlistContext = createContext<WishlistContextProps | undefined>(undefined);

export const WishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
    switch (action.type) {
        case 'ADD_TO_WISHLIST':
            const newItem: WishlistItem = { ...action.payload };
            return {
                ...state,
                wishlistArray: [...state.wishlistArray, newItem],
            };
        case 'REMOVE_FROM_WISHLIST':
            return {
                ...state,
                wishlistArray: state.wishlistArray.filter((item) => item.id !== action.payload),
            };
        case 'LOAD_WISHLIST':
            return {
                ...state,
                wishlistArray: action.payload,
            };
        default:
            return state;
    }
};

export const useWishlist = (Context) => {
    const context = useContext(Context);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};