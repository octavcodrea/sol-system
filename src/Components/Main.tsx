import { group } from 'console';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as THREE from 'three'
import React, { Suspense, useRef , CSSProperties} from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Canvas, useFrame, extend, useThree, ReactThreeFiber } from 'react-three-fiber';
import Planet from './Planet';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Sun from './Sun';
import Orbit from './Orbit';
import planetData from './planetData';
import { CSSTransition } from 'react-transition-group';
import Loading from './Loading';


// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
extend({ OrbitControls });

declare global {
    namespace JSX {
      interface IntrinsicElements {
        orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
      }
    }
  }

interface MainProps{

}

interface MainState{
    isLoaded: boolean
    planets: any,
    error: string,
    mouseX: number,
    mouseY: number,

    infoName: string,
    infoDiameter: string,
    infoDescription: string,
    infoVisible: boolean,
    infoBodyType: string,
    appInfoHovered: boolean
}



const CameraControls = () => {
    const {
      camera,
      gl: { domElement },
    } = useThree();

    const controlsRef = useRef<OrbitControls>(null);
    useFrame(() => controlsRef?.current?.update());
    return (
        <orbitControls
            ref={controlsRef}
            args={[camera, domElement]}
            enableZoom={true}
            // maxAzimuthAngle={Math.PI / 4}
            // maxPolarAngle={Math.PI}
            // minAzimuthAngle={-Math.PI / 4}
            // minPolarAngle={0}
        />
    );
};

class Main extends React.Component<MainProps, MainState>{
    constructor(props: MainProps){
        super(props);

        this.state = {
            isLoaded: false,
            planets: [{}],
            error: '',
            mouseX: 0,
            mouseY: 0,

            infoName: '',
            infoDiameter: '',
            infoDescription: '',
            infoVisible: false,
            infoBodyType: "Planet",
            appInfoHovered: false
        }

        this._onMouseMove = this._onMouseMove.bind(this);
    }

    _onMouseMove(e: { nativeEvent: { offsetX: any; offsetY: any; }; }) {
        this.setState({ 
            mouseX: e.nativeEvent.offsetX, 
            mouseY: e.nativeEvent.offsetY 
        });
    }

    getInfoDiv = (planetName: string) => {
        let arrIndex = planetData.findIndex(function (element){
            return element.name === planetName
        })

        this.setState({
            infoVisible: true,
            infoBodyType: planetData[arrIndex].type,
            infoName: planetData[arrIndex].name,
            infoDiameter: planetData[arrIndex].diameter,
            infoDescription: planetData[arrIndex].description
        })
    }

    closeInfoDiv = () =>{
        this.setState({
            infoVisible: false
        })
    }
    
    //API doesn't have an elegant solution for getting data for multiple planets at once so we do multiple fetches like the savages that we are
    planetslist = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Neptune", "Uranus"];
    dwarfplanetslist = ["Ceres", "Pluto", "Makemake", "Haumea", "Eris"]
    moonlist = ["The Moon"]

    //default values
    planetsArray: any[] = [
        {sso:{name: "Mercury",
            parameters: {diameter: 4875.2}},
        data:[{px: -0.0196, py: -0.4104}]},

        {sso:{name: "Venus",
            parameters: {diameter: 12103.6}},
        data:[{px: 0.2464, py: 0.6235}]},

        {sso:{name: "Earth",
            parameters: {diameter: 12756.2}},
        data:[{px: 1.0035, py: 0.0001}]},

        {sso:{name: "Mars",
            parameters: {diameter: 6780}},
        data:[{px: 1.3857, py: 0.1879}]},

        {sso:{name: "Jupiter",
            parameters: {diameter: 139822}},
        data:[{px: 2.4118, py: -4.140}]},

        {sso:{name: "Saturn",
            parameters: {diameter: 116464}},
        data:[{px: 5.0458, py: -7.903}]},

        {sso:{name: "Neptune",
            parameters: {diameter: 49244}},
        data:[{px: 29.40525, py: -4.8623}]},

        {sso:{name: "Uranus",
            parameters: {diameter: 50724}},
        data:[{px: 15.5979, py: 11.2291}]},

    ];

    dwarfPlanetsArray: any[] = [
        {sso:{name: "Ceres",
            parameters: {diameter: 848.4}},
        data:[{px: 2.756, py: -0.701}]},

        {sso:{name: "Pluto",
            parameters: {diameter: 2376.4}},
        data:[{px: 13.7649, py: -28.3889}]},

        {sso:{name: "Makemake",
            parameters: {diameter: 1430}},
        data:[{px: -46.1840, py: -14.3186}]},

        {sso:{name: "Haumea",
            parameters: {diameter: 1632}},
        data:[{px: -39.5285, py: -27.9121}]},

        {sso:{name: "Eris",
            parameters: {diameter: 2362}},
        data:[{px: 86.0723, py: 42.3329}]},
    ];

    moonArray: any[] = [
        {sso:{name: "The Moon",
            parameters: {diameter: 3400}},
        data:[{px: 1.0135, py: 0.0001}]},
    ]

    fetchPlanet = (index: number, link: string, type: string) =>{

        fetch(link)
            .then(res => res.json())
            .then(
            (result:object) => {
                switch(type){
                    default: this.planetsArray[index] = result; break;
                    case "planet": this.planetsArray[index] = result; break;
                    case "dwarfplanet": this.dwarfPlanetsArray[index] = result; break;
                }
                
                // console.log("result:",result);
            },
            (error) => {
                this.setState({
                isLoaded: false,
                error: 'miriade error'
                });
            }
            )
        this.forceUpdate();
    }

    componentDidMount = () =>{
        console.log("fetching . . .");
    
        for (let i = 0; i<this.planetslist.length;i++){
            let targetURL = `https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=${this.planetslist[i]}&-type=planet&-ep=now&-tcoor=2&-observer=@sun&-mime=json`

            //set a short delay in between so we don't spam the server with 10 fetches at once.
            setTimeout(() => this.fetchPlanet(i,targetURL, "planet"), i*400);
        }

        for (let k = 0; k<this.dwarfplanetslist.length;k++){
            let targetURLDP = `https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=${this.dwarfplanetslist[k]}&-type=Dwarf Planet&-ep=now&-tcoor=2&-observer=@sun&-mime=json`

            //set a short delay in between so we don't spam the server with 10 fetches at once.
            setTimeout(() => this.fetchPlanet(k,targetURLDP, "dwarfplanet"), k*400);
        }

        let moonURL = `https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=Moon&-ep=now&-tcoor=2&-observer=@sun&-mime=json`

        // setTimeout(() => console.log("planetsArray:",this.planetsArray), 4000);
        setTimeout(() => this.setState({isLoaded: true,}), 4000);
    }

    formatPlanetsAndOrbits = () => {
        if(this.state.isLoaded === true){
            console.log(['formatPlanets is doing its thing'])
            let planetsJSXlist = this.planetsArray.concat(this.dwarfPlanetsArray);
            planetsJSXlist = planetsJSXlist.map((elem) => {
                return(
                    <React.Fragment>
                    <Planet 
                        hoverIn={(e:any) => this.getInfoDiv(elem.sso.name)}
                        hoverOut={(e:any) => this.closeInfoDiv()}
                        name={elem.sso.name}
                        propScale={elem.sso.parameters.diameter / 100}
                        propX={elem.data[0].px}
                        propY={elem.data[0].py}
                    />

                    <Orbit
                        distX={elem.data[0].px}
                        distY={elem.data[0].py}
                        type={elem.sso.type}
                    />
                    </React.Fragment>
                )
            });

            let moon = (
                <Planet 
                    hoverIn={(e:any) => this.getInfoDiv("The Moon")}
                    hoverOut={(e:any) => this.closeInfoDiv()}
                    name={"The Moon"}
                    propScale={this.moonArray[0].sso.parameters.diameter / 1000}
                    propX={this.moonArray[0].data[0].px}
                    propY={this.moonArray[0].data[0].py}
                />
            )

            return(
                <React.Fragment>
                    <Sun 
                        hoverIn={(e:any) => this.getInfoDiv("The Sun")}
                        hoverOut={(e:any) => this.closeInfoDiv()}
                    />
                    {planetsJSXlist}
                    {moon}
                </React.Fragment>
            )
        }else{
            return(
                <React.Fragment>
                    <Loading 
                        hoverIn={(e:any) => this.getInfoDiv("Loading")}
                        hoverOut={(e:any) => this.closeInfoDiv()}    
                    />
                </React.Fragment>
            )
        }
    }

    formatDate = (date: Date) =>{
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();
    
    return [date.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
            ].join(' ');
          
    }

    formatBottomPanel = () => {
        let panelContent = (<div></div>);
        switch(this.state.isLoaded){
            default: panelContent = (
                <div className="bottomPanel">
                    <h1>Fetching data . . .</h1>
                </div>
            );
            break;

            case false: 
                panelContent = (
                    <div className="bottomPanel">
                        <h1>Fetching data . . .</h1>
                    </div>
                );
            break;

            case true:  {
                // var date = new Date();
                
                panelContent = (
                    <div className="bottomPanel">
                        <h1>Displaying data for {this.formatDate(new Date())}</h1>
                    </div>
                );
                break;
            }
        }

        return(
            <CSSTransition
                in={this.state.isLoaded}
                timeout={300}
                classNames="bottomPanel"
                // unmountOnExit
                // onEnter={() => setShowButton(false)}
                // onExited={() => setShowButton(true)}
            >
                {panelContent}
            </CSSTransition>
        )
    }

    formatAppIcon = () =>{
        return(
            <div>
                <div className="appIcon" 
                    onMouseEnter={this.onAppIconHoverIn} 
                    onMouseLeave={this.onAppIconHoverOut}>
                    <svg>
                        <g>
                            <path className="a" d="M40.3228,1.9813c2.7365-.2184,4.8169.3475,5.868,1.8029,3.0294,4.1946-3.626,14.1751-14.8652,22.2922S8.52,37.3733,5.49,33.1787c-1.0511-1.4554-.9341-3.6082.1335-6.1372C.6047,33.5632-1.3756,39.4553,1.0005,42.7454c4.1446,5.7387,19.97,1.3884,35.3461-9.7168S60.8285,8.2689,56.6839,2.53C54.3078-.76,48.0918-.7326,40.3228,1.9813Z"/>
                            <path className="a" d="M37.8649,35.131a89.4745,89.4745,0,0,1-11.29,6.9732c.3352.0167.671.0313,1.0105.0313A21.007,21.007,0,0,0,47.8137,26.7772,88.6036,88.6036,0,0,1,37.8649,35.131Z"/>
                            <path className="a" d="M27.5853.1234a21.0016,21.0016,0,0,0-17.71,32.2973,15.9549,15.9549,0,0,0,4.7662-.6768,50.0086,50.0086,0,0,0,15.1655-7.77A50.0032,50.0032,0,0,0,41.9512,12.0206a16.7769,16.7769,0,0,0,2.04-3.982A20.9444,20.9444,0,0,0,27.5853.1234ZM12.2845,30.5851a1.4163,1.4163,0,1,1,1.4163-1.4163A1.4162,1.4162,0,0,1,12.2845,30.5851Zm6.224-2.11a2.4182,2.4182,0,1,1,2.4183-2.4182A2.4182,2.4182,0,0,1,18.5085,28.475Z"/>
                        </g>
                    </svg>
                </div>


                <CSSTransition
                    in={this.state.appInfoHovered}
                    timeout={300}
                    classNames="appInfo appInfo"
                    // unmountOnExit
                    // onEnter={() => setShowButton(false)}
                    // onExited={() => setShowButton(true)}
                >
                    <div>
                        <h1>Sol System</h1>
                        <h2>A solar system visualizer made by Octav Codrea</h2>
                        <br/>
                        <p>This app gets daily data from the Institute of Celestial Mechanics and Ephemeris Calculations of Paris and constructs a visualization of our solar system based on the celestial bodies' current coordinates.</p>
                        <br/>
                        <p>The planets' sizes in the visualization do not accurately reflect their size in reality and were instead enlarged for easier viewing.</p>
                        <br/>
                        <p>Camera controls:</p>
                        <p>Pan: Click + drag left mouse button </p>
                        <p>Move: Click + drag right mouse button </p>
                        <p>Zoom: Scroll/hold mouse wheel </p>

                    </div>
                </CSSTransition>
            </div>
        )
    }

    onAppIconHoverIn = () =>{
        this.setState({
            appInfoHovered: true
        })
    }

    onAppIconHoverOut = () =>{
        this.setState({
            appInfoHovered: false
        })
    }

    render(){
        return(
            <React.Fragment>
                <Canvas
                    // orthographic camera={{ zoom: 5, position: [0, 0, 100] }}
                    camera={{ zoom: 2, position: [0, 75, 300], near: 0.01, far: 50000}}
                    onMouseMove={this._onMouseMove.bind(this)}
                >
                    <CameraControls />
                    <ambientLight
                        color={'#ffffff'}
                    />

                    <pointLight 
                        position={[10, 10, 10]} 
                        color={'white'}
                    />

                    <Suspense fallback={<Loading />}>
                        {this.formatPlanetsAndOrbits()}
                    </Suspense>
                </Canvas>


                <CSSTransition
                    in={this.state.infoVisible}
                    timeout={300}
                    classNames="planetInfo planetInfo"
                    unmountOnExit
                    // onEnter={() => setShowButton(false)}
                    // onExited={() => setShowButton(true)}
                >
                    {/* <div className={this.state.infoVisible? "planetInfo-visible" : "planetInfo-hidden"}  */}
                    <div className="planetInfo-visible"
                        style={{top: `${this.state.mouseY - 70}px` ,left: `${this.state.mouseX + 30}px`}}
                    >
                        
                        <h1>{this.state.infoName}</h1>
                        <h2>{this.state.infoBodyType}</h2>
                        <h2>Diameter: {this.state.infoDiameter}</h2>
                        <p>{this.state.infoDescription}</p>
                    </div>
                </CSSTransition>

                {this.formatBottomPanel()}
                {this.formatAppIcon()}
            </React.Fragment>
        )
    }
}

export default Main;