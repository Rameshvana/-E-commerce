//import { BrowserRouter, Routes,Route } from 'react-router-dom';
import {BrowserRouter,Route, Switch, Redirect} from 'react-router-dom'
import { Component } from 'react';
import './App.css';
import CartContext from './context/CartContext'

import Home from './Components/Home';
import LoginForm from './Components/LoginForm';
import ProtectedRoute from './Components/ProtectedRoute'
import Products from './Components/Products'
import ProductItemDetails from './Components/ProductItemDetails'
import Cart from './Components/Cart'
import NotFound from './Components/NotFound'


class App extends Component{
  state = { cartList: [],}

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  incrementCartItemQuantity = id => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(eachCartItem => {
        if (id === eachCartItem.id) {
          const updatedQuantity = eachCartItem.quantity + 1
          return {...eachCartItem, quantity: updatedQuantity}
        }
        return eachCartItem
      }),
    }))
  }

  decrementCartItemQuantity = id => {
    const {cartList} = this.state
    const productObject = cartList.find(eachCartItem => eachCartItem.id === id)
    if (productObject.quantity > 1) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(eachCartItem => {
          if (id === eachCartItem.id) {
            const updatedQuantity = eachCartItem.quantity - 1
            return {...eachCartItem, quantity: updatedQuantity}
          }
          return eachCartItem
        }),
      }))
    } else {
      this.removeCartItem(id)
    }
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const updatedCartList = cartList.filter(
      eachCartItem => eachCartItem.id !== id,
    )

    this.setState({cartList: updatedCartList})
  }

  addCartItem = product => {
    const {cartList} = this.state
    const productObject = cartList.find(
      eachCartItem => eachCartItem.id === product.id,
    )

    if (productObject) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(eachCartItem => {
          if (productObject.id === eachCartItem.id) {
            const updatedQuantity = eachCartItem.quantity + product.quantity

            return {...eachCartItem, quantity: updatedQuantity}
          }

          return eachCartItem
        }),
      }))
    } else {
      const updatedCartList = [...cartList, product]

      this.setState({cartList: updatedCartList})
    }
  }

  render(){
    const {cartList} = this.state

    return (
      <CartContext.Provider
      value={{
        cartList,
        addCartItem: this.addCartItem,
        removeCartItem: this.removeCartItem,
        incrementCartItemQuantity: this.incrementCartItemQuantity,
        decrementCartItemQuantity: this.decrementCartItemQuantity,
        removeAllCartItems: this.removeAllCartItems,
      }}
    >
      
      <Switch>
        <Route exact path="/login" component={LoginForm} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/products" component={Products} />
        <ProtectedRoute exact path="/products/:id" component={ProductItemDetails}/>
        <ProtectedRoute exact path="/cart" component={Cart} />
        <Route path="/not-found" component={NotFound} />

      </Switch>
    
      </CartContext.Provider>
    );
  }
}


export default App;
