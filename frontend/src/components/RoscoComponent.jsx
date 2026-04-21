import React from 'react';
import './RoscoComponent.css';

export default function HeroComponent() {
    return (
        <div className='menu'>
            <div className='titulo'>
                <h2>Menú principal</h2>
                </div>
            <div className='opciones'>
                <button className='botonJugar'>Jugar</button>
                <button className='botonSalir'>Salir</button>

            </div>
        </div>
    )
}
