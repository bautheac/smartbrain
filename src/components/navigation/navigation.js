import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {    

        if (isSignedIn) {
            return (
                <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <p onClick={ () => onRouteChange('signIn') } className='f5 link dim black pa1 pointer'>sign out</p>
                </nav>
            );      
        } else {
            return (
                <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <p onClick={ () => onRouteChange('signIn') } className='f5 link dim black pa3 pointer'>sign in</p>
                    <p onClick={ () => onRouteChange('register') } className='f5 link dim black pa3 pointer'>register</p>
                </nav>
            );            
        }     
}

export default Navigation;