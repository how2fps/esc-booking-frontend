'use client'

// WishlistContext.tsx
import React, { createContext, useState, useReducer, useEffect } from 'react';
import {WishlistReducer, WishlistContext, WishlistAction, WishlistItem} from './Wishlist';
import { TentType } from '../../type/HotelType';
export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlistState, dispatch] = useReducer(WishlistReducer, { wishlistArray: [] });

    const addToWishlist = (item: TentType) => {
        dispatch({ type: 'ADD_TO_WISHLIST', payload: item });
    };

    const removeFromWishlist = (itemId: string) => {
        dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: itemId });
    };

    return (
        <WishlistContext.Provider value={{ wishlistState, addToWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};


