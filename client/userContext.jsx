import React, { Component } from 'react'
export const user = {
    openid: '',
    shopId: 0,
};

export const UserContext = React.createContext(
    user
);
