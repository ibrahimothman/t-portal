import { useNavigate } from 'react-router-dom'

export default function BusinessArchitecture() {
	const navigate = useNavigate()

	const handleNavigation = (route) => {
		navigate(route)
	}
	return (
		<svg 
			style={{ width: '100%', height: 'auto', maxHeight: '70vh' }} 
			xmlns="http://www.w3.org/2000/svg" 
			viewBox="0 0 1890 1890"
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
        
            <image href="/images/business-architecture.svg" style={{ width: '100%' }}></image>
            <g onClick={() => handleNavigation('/business/stakeholders')} style={{ cursor: 'pointer' }} title="Stakeholders">
            <rect x="725.1282051282051" y="134.6153846153846" width="441.53846153846166" height="206.41025641025644" className="image-mapper-shape" data-index="1"></rect>
            </g>
            <g  style={{ cursor: 'pointer' }} title="Vision, Strategy & Tactics">
            <rect x="1238.4615384615386" y="479.2307692307692" width="448.7179487179485" height="206.4102564102564" className="image-mapper-shape" data-index="2"></rect>
            </g>
            <g  style={{ cursor: 'pointer' }} title="Policies, Rules, & Regulations">
            <rect x="202.82051282051282" y="479.2307692307692" width="448.71794871794873" height="206.4102564102564" className="image-mapper-shape" data-index="3"></rect>
            </g>
            <g onClick={() => handleNavigation('/business/business-capabilities')} style={{ cursor: 'pointer' }} title="Capabilities">
            <rect x="732.3076923076923" y="576.1538461538462" width="425.38461538461536" height="202.82051282051282" className="image-mapper-shape" data-index="4"></rect>
            </g>
            <g  style={{ cursor: 'pointer' }} title="Organization">
            <rect x="466.6666666666667" y="845.3846153846154" width="428.97435897435895" height="195.64102564102575" className="image-mapper-shape" data-index="5"></rect>
            </g>
            <g onClick={() => handleNavigation('/business/information-map')} style={{ cursor: 'pointer' }} title="Information">
            <rect x="994.3589743589744" y="845.3846153846154" width="427.17948717948707" height="197.43589743589757" className="image-mapper-shape" data-index="6"></rect>
            </g>
            <g onClick={() => handleNavigation('/business/value-streams')} style={{ cursor: 'pointer' }} title="Value Stream">
            <rect x="728.7179487179487" y="1100.2564102564102" width="428.9743589743589" height="199.23076923076928" className="image-mapper-shape" data-index="7"></rect>
            </g>
            <g onClick={() => handleNavigation('/business/services')} style={{ cursor: 'pointer' }} title="Products & Services">
            <rect x="204.6153846153846" y="1204.3589743589744" width="446.9230769230769" height="206.41025641025635" className="image-mapper-shape" data-index="8"></rect>
            </g>
            <g onClick={() => handleNavigation('/strategy/projects-portfolio')} style={{ cursor: 'pointer' }} title="Initiatives & Projects">
            <rect x="1238.4615384615386" y="1204.3589743589744" width="445.1282051282051" height="208.20512820512818" className="image-mapper-shape" data-index="9"></rect>
            </g>
            <g  style={{ cursor: 'pointer' }} title="Metrics & Measures">
            <rect x="398.46153846153845" y="1489.7435897435898" width="441.53846153846155" height="204.61538461538453" className="image-mapper-shape" data-index="10"></rect>
            </g>
            <g  style={{ cursor: 'pointer' }} title="Decision & Events">
            <rect x="1050" y="1489.7435897435898" width="437.948717948718" height="204.61538461538453" className="image-mapper-shape" data-index="11"></rect>
            </g>
            </svg>
  )
}
