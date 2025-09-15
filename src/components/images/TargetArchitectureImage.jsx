import { useNavigate } from 'react-router-dom'

export default function TargetArchitectureImage({ onItemSelected }) {
	const navigate = useNavigate()

	const handleNavigation = (route) => {
		navigate(route)
	}

	return (
		<svg 
			style={{ width: '100%', height: 'auto', maxHeight: '100vh' }} 
			xmlns="http://www.w3.org/2000/svg" 
			viewBox="0 0 1202 600"
			preserveAspectRatio="xMidYMid meet"
		>
            <style>
                {`
                .image-mapper-shape {
                    fill: rgba(0, 0, 0, 0);
                    transition: all 0.2s ease-in-out;
                }
                g:hover .image-mapper-shape {
                    stroke: #4f46e5;
                    stroke-width: 4px;
                    opacity: 100%;
                }
                `}
            </style>
        
            <image href="/images/target-architecture.svg" x="0" y="0" width="100%" height="90%"></image>
            <g  title="Users">
            <rect x="10.732142857142858" y="5.962301587301587" width="1182.920634920635" height="23.849206349206348" className="image-mapper-shape" data-index="1"></rect>
            </g>
            
            <g  style={{ cursor: 'pointer' }} title="Channels">
            <rect x="9.636042780780063" y="32.76254545465221" width="1183.3060534797914" height="26.980919786184174" className="image-mapper-shape" data-index="2"></rect>
            </g>
            
            <g onClick={() => onItemSelected('iot-service')} style={{ cursor: 'pointer' }} title="IoT as a Service">
            <rect x="21.199294117716136" y="354.9621667262179" width="77.0883422462405" height="57.46046429116876" className="image-mapper-shape" data-index="3"></rect>
            </g>
            
            <g onClick={() => onItemSelected('cloud-functions')} style={{ cursor: 'pointer' }} title="Cloud Functions">
            <rect x="11.563251336936075" y="482.1579314325147" width="1175.5972192551676" height="26.62512739267254" className="image-mapper-shape" data-index="4"></rect>
            </g>
            
            <g onClick={() => onItemSelected('elastic-cloud')} style={{ cursor: 'pointer' }} title="Elastic Cloud Infrastructure">
            <rect x="13.698005698005698" y="512.5337132003799" width="1174.6039886039885" height="23.97150997150993" className="image-mapper-shape" data-index="5"></rect>
            </g>
            
            <g onClick={() => onItemSelected('dxp')} style={{ cursor: 'pointer' }} title="Digital Experience Platform Core">
            <rect x="111.86704653371321" y="63.92402659069326" width="1077.576448243115" height="67.34852801519467" className="image-mapper-shape" data-index="6"></rect>
            </g>
            
            <g onClick={() => onItemSelected('analytics-service')} style={{ cursor: 'pointer' }} title="Analytics as a Service">
            <rect x="858.4083570750238" y="244.28110161443496" width="117.57454890788222" height="180.35707502374166" className="image-mapper-shape" data-index="7"></rect>
            </g>
            
            <g onClick={() => onItemSelected('data-service')} style={{ cursor: 'pointer' }} title="Data as a Service">
            <polygon className="image-mapper-shape" data-index="8" points="465.132,323.689 476.013,301.928 497.773,288.328 529.054,276.087 569.855,266.567 632.417,267.927 678.658,276.087 711.299,289.688 728.979,308.728 735.78,333.209 719.459,356.329 680.018,375.37 635.137,387.61 575.295,386.25 524.974,378.09 500.493,365.85 473.293,348.169"></polygon>
            </g>
            
            <g onClick={() => onItemSelected('cloud-erp')} style={{ cursor: 'pointer' }} title="Cloud ERP System">
            <polygon className="image-mapper-shape" data-index="9" points="372.65,354.969 432.492,354.969 452.892,382.17 474.653,397.131 511.374,414.811 552.175,425.691 584.816,431.131 604.881,431.131 605.216,480.434 550.815,477.373 500.493,465.132 452.892,443.372 416.171,414.811 390.33,387.61"></polygon>
            </g>
            
            <g onClick={() => onItemSelected('cloud-assets')} style={{ cursor: 'pointer' }} title="Cloud Asset Management">
            <polygon className="image-mapper-shape" data-index="10" points="827.567,355.353 769.137,356.546 753.635,375.625 735.748,391.127 699.974,410.206 663.008,423.323 630.812,428.093 608.155,430.478 610.54,480.561 655.853,475.792 686.857,469.829 733.363,451.942 771.522,429.286 803.718,397.089"></polygon>
            </g>
            
            <g onClick={() => onItemSelected('saas')} style={{ cursor: 'pointer' }} title="Software as a Service">
            <polygon className="image-mapper-shape" data-index="11" points="423.323,317.194 370.855,317.194 378.01,294.538 394.704,268.304 426.901,237.3 463.867,212.258 512.758,190.794 579.536,177.677 651.083,177.677 710.706,196.756 772.714,231.337 808.488,264.726 825.183,289.768 837.107,314.81 782.254,316.002 745.288,271.881 688.05,242.069 626.042,227.76 558.071,227.76 499.641,246.839 451.942,279.036"></polygon>
            </g>
            
            <g onClick={() => onItemSelected('multi-experience')} style={{ cursor: 'pointer' }} title="Multi-Experience Platform">
            <polygon className="image-mapper-shape" data-index="12" points="366.085,137.133 832.337,138.325 837.107,264.726 792.986,217.028 742.903,183.639 667.778,157.405 602.192,155.02 536.607,159.79 472.214,178.869 420.939,207.488 392.319,231.337 366.085,265.919"></polygon>
            </g>
            
            </svg>


  )
}
