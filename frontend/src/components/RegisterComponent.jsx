import React from 'react'
import './LoginComponent.css'

export default function RegisterComponent() {
    return (
        <div>
            <form action="">
                <input id='usuario' type="text" placeholder='Nombre de Usuario' className='customInput'/><br /><br />
                <input id='correo' type="text" placeholder='Correo Electrónico' className='customInput'/><br /><br />
                <input id='contraseña' type="text" placeholder='Contraseña' className='customInput'/> <br /><br />
                <button type="submit" className="customButton btn-login">
                Registrarse
                </button>
                {/* Este botón NO envía el formulario, solo ejecuta su función */}
                <button type="button" className="customButton btn-guest">
                    Continuar como invitado
                </button>
            </form>
        </div>
    )
}
