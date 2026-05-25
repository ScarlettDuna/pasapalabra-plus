import React from 'react'
import HeaderComponent from '../components/HeaderComponent'
import FooterComponent from '../components/FooterComponent'
import RegisterComponent from '../components/RegisterComponent'

export default function Register() {
  return (
    <div>
      <HeaderComponent></HeaderComponent>
        <h2>REGISTRARSE</h2>
      <RegisterComponent></RegisterComponent>
      <FooterComponent></FooterComponent>
    </div>
  )
}
