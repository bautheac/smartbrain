import React, { Component } from 'react';
import Navigation from './components/navigation/navigation.js';
import Logo from './components/logo/logo.js';
import ImageLinkForm from './components/imageLinkForm/imageLinkForm.js';
import FaceRecognition from './components/faceRecognition/faceRecognition.js';
import SignIn from './components/signIn/signIn.js';
import Register from './components/register/register.js';
import Rank from './components/rank/rank.js'
import Particles from 'react-particles-js';
import './App.css';

const backEndpoint = "https://pure-lowlands-01387.herokuapp.com";

const particlesOptions = {
  particles: { number: { value: 200, density: { enable: true, value_area: 800 }}}
}

const initialState = {
  input: '', imageUrl: '', box: {}, route: 'signIn', isSignedIn: false, 
  user: { id: '', name: '',  email: '', password: '', entries: 0, joined: '' }
}

class App extends Component {

  constructor() { super(); this.state = initialState }

  loadUser = (user) => {
    const { id, name, email, password, entries, joined } = user;
    this.setState({ 
      user: { id: id, name: name,  email: email, password: password, entries: entries, joined: joined }
    })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }


  displayFaceBox = (box) => { console.log(box); this.setState({box: box}) }

  onInputChange = (event) => { this.setState({ input: event.target.value })}

  onButtonSubmit = () => {
    if (this.state.input) {

      this.setState({ imageUrl: this.state.input })

      fetch(`${ backEndpoint }/clarifai`, { 
        method: "post", headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ input: this.state.input })})
      .then(res => res.json())
      .then( res => {
        if ( res ) {
          fetch( `${ backEndpoint }/image`, { 
          method: "put", headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ id: this.state.user.id })})
          .then(res => res.json())
          .then(count => { Object.assign( this.state.user, { entries: count })})
          .catch(console.log)
        }
        this.displayFaceBox( this.calculateFaceLocation(res) );
      })
      .catch( err => console.log( err ) );
    }    
  }

  onRoutechange = ( route ) => {
    if (route === 'signOut') this.setState({ isSignedIn: false });
    else if (route === 'signIn') this.setState(initialState);
    else if (route === 'home') this.setState({ isSignedIn: true });
    this.setState({ route: route })
  }

  render() {
    const { isSignedIn, route, box, imageUrl } = this.state;
    return (
      <div className="App">

        <Particles className='particles' params={ particlesOptions } />
        <Navigation isSignedIn={ isSignedIn } onRouteChange={ this.onRoutechange }/>

        {
          route === 'home' 
            ? <div>
              <Logo />
              <Rank name={ this.state.user.name } entries={ this.state.user.entries } />
              <ImageLinkForm onInputChange={ this.onInputChange } onButtonSubmit={ this.onButtonSubmit }/>
              <FaceRecognition box={ box } imageUrl={ imageUrl }/>
            </div>
            : (
              route === 'signIn'
                ? <SignIn loadUser={ this.loadUser } onRouteChange={ this.onRoutechange }/>
                : <Register loadUser={ this.loadUser } onRouteChange={ this.onRoutechange }/>
            )
        }
        
      </div>
    );
  }  
}

export default App;
